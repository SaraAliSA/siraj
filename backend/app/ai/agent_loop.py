import uuid
import json
import asyncio
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from google import genai
from google.genai import types

from backend.app.config import settings
from backend.app.models.chat import ChatMessage
from backend.app.ai.system_prompt import get_system_prompt
from backend.app.ai.context_builder import build_context
from backend.app.ai.tools import SirajTools

async def run_agent_loop(
    session_id: uuid.UUID,
    user_message: str,
    user_id: uuid.UUID,
    db: AsyncSession
) -> AsyncGenerator[str, None]:
    # 1. Initialize Gemini Client
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    # 2. Build dynamic context and system prompt
    context_str = await build_context(user_id, db)
    system_prompt = get_system_prompt(context_str)
    
    # 3. Load previous chat history from DB
    history_res = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    )
    history_msgs = history_res.scalars().all()
    
    # 4. Construct content list for Gemini
    # Ensure correct format for Gemini SDK (types.Content or standard structure)
    contents = []
    
    for msg in history_msgs:
        if msg.role == "user":
            contents.append(types.Content(
                role="user",
                parts=[types.Part.from_text(text=msg.content)]
            ))
        elif msg.role == "assistant":
            # If assistant message has saved content
            if msg.content:
                contents.append(types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=msg.content)]
                ))
            # If assistant message has tool call metadata, reconstruct it
            if msg.tool_metadata and "function_calls" in msg.tool_metadata:
                calls = []
                for fc in msg.tool_metadata["function_calls"]:
                    calls.append(types.Part(
                        function_call=types.FunctionCall(
                            name=fc["name"],
                            args=fc["args"]
                        )
                    ))
                if calls:
                    contents.append(types.Content(role="model", parts=calls))
        elif msg.role == "tool":
            # Reconstruct tool response part
            if msg.tool_metadata and "function_response" in msg.tool_metadata:
                fr = msg.tool_metadata["function_response"]
                contents.append(types.Content(
                    role="tool",
                    parts=[types.Part(
                        function_response=types.FunctionResponse(
                            name=fr["name"],
                            response=fr["response"]
                        )
                    )]
                ))

    # Initialize tool helper
    tools_instance = SirajTools(user_id, db)
    
    genai_tools = [
        tools_instance.get_transactions,
        tools_instance.get_financial_summary,
        tools_instance.get_category_breakdown,
        tools_instance.get_budget_analysis,
        tools_instance.get_recurring_charges,
        tools_instance.add_transaction,
        tools_instance.set_budget,
        tools_instance.create_savings_plan,
        tools_instance.create_spending_alert,
        tools_instance.simulate_scenario,
        tools_instance.submit_financing_request,
        tools_instance.get_financing_status,
        tools_instance.get_investment_recommendations,
        tools_instance.submit_investment_request,
        tools_instance.create_financial_goal,
    ]
    
    tool_map = {f.__name__: f for f in genai_tools}
    
    # 5. Agent loop for tool calling
    loop_count = 0
    max_loops = 5
    
    while loop_count < max_loops:
        loop_count += 1
        
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=genai_tools,
            temperature=0.2,
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
        )
        # Call model to get next step
        try:
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=contents,
                config=config
            )
        except Exception as e:
            print(f"Exception: {e}")
            raise e
        
        # If there are function calls requested by the model
        if response.function_calls:
            model_parts = []
            tool_parts = []
            
            # Record the function calls in assistant message metadata
            function_calls_meta = []
            
            for call in response.function_calls:
                name = call.name
                args = call.args
                
                # Yield a friendly Arabic indicator to client
                arabic_tool_names = {
                    "get_transactions": "جاري مراجعة المعاملات المالية...",
                    "get_financial_summary": "جاري حساب الملخص المالي...",
                    "get_category_breakdown": "جاري تحليل فئات الإنفاق...",
                    "get_budget_analysis": "جاري فحص الالتزام بالميزانية...",
                    "get_recurring_charges": "جاري الكشف عن الفواتير والاشتراكات المتكررة...",
                    "add_transaction": "جاري إضافة المعاملة الجديدة...",
                    "set_budget": "جاري تحديث ميزانيتك...",
                    "create_savings_plan": "جاري إنشاء حصالة الادخار...",
                    "create_spending_alert": "جاري إعداد تنبيه الإنفاق...",
                    "simulate_scenario": "جاري محاكاة السيناريو المالي...",
                    "submit_financing_request": "جاري إرسال طلب التمويل الإسلامي...",
                    "get_financing_status": "جاري التحقق من حالة طلبات التمويل...",
                    "get_investment_recommendations": "جاري جلب الفرص الاستثمارية الملائمة...",
                    "submit_investment_request": "جاري تقديم طلب الاستثمار المالي...",
                    "create_financial_goal": "جاري جدولة الهدف المالي الموسمي..."
                }
                status_msg = arabic_tool_names.get(name, f"جاري تنفيذ العملية: {name}...")
                yield f"data: {json.dumps({'status': status_msg}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.5) # small pause for realistic demo flow
                
                # Execute tool
                tool_func = tool_map.get(name)
                if tool_func:
                    try:
                        result = await tool_func(**args)
                    except Exception as e:
                        result = {"status": "error", "message": str(e)}
                else:
                    result = {"status": "error", "message": f"Tool {name} not found."}
                
                # Reconstruct for GenAI history
                model_parts.append(types.Part(
                    function_call=types.FunctionCall(
                        name=name,
                        args=args
                    )
                ))
                
                tool_parts.append(types.Part(
                    function_response=types.FunctionResponse(
                        name=name,
                        response={"result": result}
                    )
                ))
                
                function_calls_meta.append({
                    "name": name,
                    "args": args
                })
                
                # Save the tool response message into the database
                tool_msg = ChatMessage(
                    session_id=session_id,
                    role="tool",
                    content=None,
                    tool_metadata={"function_response": {"name": name, "response": result}}
                )
                db.add(tool_msg)
            
            # Save the model's tool calls message to database
            model_msg = ChatMessage(
                session_id=session_id,
                role="assistant",
                content=None,
                tool_metadata={"function_calls": function_calls_meta}
            )
            db.add(model_msg)
            await db.commit()
            
            # Add to Gemini history contents
            contents.append(types.Content(role="model", parts=model_parts))
            contents.append(types.Content(role="tool", parts=tool_parts))
            
            # Continue the loop to let the model process the tool results
            continue
            
        else:
            # No function calls. We can stream the final text response!
            response_stream = client.models.generate_content_stream(
                model='gemini-3.5-flash',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    tools=genai_tools,
                    temperature=0.2,
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
                )
            )
            
            full_text = ""
            for chunk in response_stream:
                if chunk.text:
                    full_text += chunk.text
                    yield f"data: {json.dumps({'content': chunk.text}, ensure_ascii=False)}\n\n"
            
            # Save assistant's final message to database
            final_msg = ChatMessage(
                session_id=session_id,
                role="assistant",
                content=full_text,
                tool_metadata={}
            )
            db.add(final_msg)
            await db.commit()
            
            # Exit loop
            break
            
    # Yield final done event
    yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"
