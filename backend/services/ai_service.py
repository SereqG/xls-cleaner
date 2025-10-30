import os
import json
from typing import Dict, Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from services.excel_operations import ExcelOperationValidator, PandasExecutor

class AIExcelService:
    """Service for AI-powered Excel operations"""
    
    SYSTEM_PROMPT = """You are an Excel data cleaning assistant. Your job is to help users clean and transform their Excel spreadsheets.

You can ONLY perform these operations:
- drop_duplicates: Remove duplicate rows
- drop_na: Remove rows with missing values
- fill_na: Fill missing values with a specified value
- remove_column: Remove a specific column
- rename_column: Rename a column
- filter_rows: Filter rows based on conditions
- sort_values: Sort data by columns
- replace_value: Replace specific values
- change_type: Change column data type
- trim_whitespace: Remove leading/trailing spaces
- upper_case, lower_case, capitalize: Change text case
- round_numbers: Round numeric values
- drop_empty_rows, drop_empty_columns: Remove empty rows/columns

When a user asks you to perform an operation, respond with a JSON object in this format:
{
    "operation": "operation_name",
    "params": {
        "param1": "value1",
        "param2": "value2"
    },
    "explanation": "A brief explanation of what this operation will do"
}

If the user's request is unclear or cannot be performed with these operations, respond with:
{
    "error": "Explanation of why the operation cannot be performed",
    "suggestion": "Optional suggestion for what they could do instead"
}

Only respond with valid JSON. Do not include any other text or explanation outside the JSON."""
    
    def __init__(self):
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required for AI Mode")
        
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.1,
            api_key=api_key
        )
    
    def parse_user_request(
        self, 
        user_message: str, 
        conversation_history: List[Dict[str, str]],
        sheet_info: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Parse user's request and determine the Excel operation to perform.
        
        Args:
            user_message: The user's message
            conversation_history: Previous conversation messages
            sheet_info: Information about the current sheet (columns, types, etc.)
        
        Returns:
            Dict containing operation details or error
        """
        messages = [SystemMessage(content=self.SYSTEM_PROMPT)]
        
        # Add sheet context if available
        if sheet_info:
            context = f"\n\nCurrent sheet information:\n"
            column_names = sheet_info.get('column_names', [])
            if isinstance(column_names, list):
                context += f"Columns: {', '.join(column_names)}\n"
            else:
                context += f"Number of columns: {sheet_info.get('columns', 0)}\n"
            context += f"Number of rows: {sheet_info.get('rows', 0)}\n"
            messages.append(SystemMessage(content=context))
        
        # Add conversation history (last 5 messages)
        for msg in conversation_history[-5:]:
            if msg['role'] == 'user':
                messages.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                messages.append(AIMessage(content=msg['content']))
        
        # Add current user message
        messages.append(HumanMessage(content=user_message))
        
        try:
            response = self.llm.invoke(messages)
            
            # Parse JSON response
            response_text = response.content.strip()
            
            # Extract JSON if it's wrapped in markdown code blocks
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            operation_data = json.loads(response_text)
            
            # Check if it's an error response
            if 'error' in operation_data:
                return {
                    'type': 'error',
                    'message': operation_data['error'],
                    'suggestion': operation_data.get('suggestion')
                }
            
            # Validate the operation
            operation = operation_data.get('operation')
            params = operation_data.get('params', {})
            
            is_valid, error_msg = ExcelOperationValidator.validate_operation(operation, params)
            
            if not is_valid:
                return {
                    'type': 'error',
                    'message': f'Invalid operation: {error_msg}'
                }
            
            return {
                'type': 'operation',
                'operation': operation,
                'params': params,
                'explanation': operation_data.get('explanation', '')
            }
            
        except json.JSONDecodeError as e:
            return {
                'type': 'error',
                'message': f'Failed to parse AI response: {str(e)}'
            }
        except Exception as e:
            return {
                'type': 'error',
                'message': f'Error processing request: {str(e)}'
            }
    
    def execute_operation(
        self, 
        file_path: str, 
        sheet_name: str, 
        operation: str, 
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute a validated operation on an Excel file.
        
        Args:
            file_path: Path to the Excel file
            sheet_name: Name of the sheet to operate on
            operation: Operation name
            params: Operation parameters
        
        Returns:
            Dict with operation results
        """
        try:
            executor = PandasExecutor(file_path, sheet_name)
            
            # Execute the operation
            result = executor.execute_operation(operation, params)
            
            # Save the modified file
            executor.save_to_file(file_path, sheet_name)
            
            # Get preview and stats
            preview = executor.get_preview(5)
            stats = executor.get_stats()
            
            return {
                'success': True,
                'result': result,
                'preview': preview,
                'stats': stats
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_sheet_preview(self, file_path: str, sheet_name: str, n_rows: int = 5) -> List[Dict[str, Any]]:
        """Get preview of a sheet"""
        try:
            executor = PandasExecutor(file_path, sheet_name)
            return executor.get_preview(n_rows)
        except Exception as e:
            raise Exception(f"Error getting preview: {str(e)}")
    
    def get_sheet_info(self, file_path: str, sheet_name: str) -> Dict[str, Any]:
        """Get information about a sheet"""
        try:
            executor = PandasExecutor(file_path, sheet_name)
            return executor.get_stats()
        except Exception as e:
            raise Exception(f"Error getting sheet info: {str(e)}")
