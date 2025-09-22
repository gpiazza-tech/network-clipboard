import os
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from starlette.responses import PlainTextResponse
from starlette.responses import FileResponse
from starlette.routing import Route

# Server

async def get_text(request):
    with open(f"clipboard/text", "r", encoding='utf-8') as t:
        return PlainTextResponse(t.read())

async def set_text(request):
    # Convert the content to text
    body_data = await request.body()
    text_data = body_data.decode('utf-8')

    # Save the text
    with open(f"clipboard/text", "w", encoding='utf-8') as t:
        t.write(text_data)

    return PlainTextResponse(text_data)

async def get_file(request):
    with open(f"clipboard/file_name", "r", encoding='utf-8') as t:
        return FileResponse("clipboard/file", filename=t.read())

async def get_file_name(request):
    with open(f"clipboard/file_name", "r", encoding='utf-8') as t:
        return PlainTextResponse(t.read())

async def set_file(request):
    async with request.form() as form:
        uploaded_file = form["file"]

        file_name = uploaded_file.filename

        with open(f"clipboard/file_name", "w", encoding='utf-8') as f:
            f.write(file_name)

        # Read the file content
        file_content = await uploaded_file.read()

        # Save the file or process its content
        with open(f"clipboard/file", "wb") as f:
            f.write(file_content)

        return JSONResponse({"message": f"File '{file_name}' uploaded successfully!"})

routes = [
    Route("/get_text", endpoint=get_text, methods=["GET"]),
    Route("/set_text", endpoint=set_text, methods=["POST"]),
    Route("/get_file", endpoint=get_file, methods=["GET"]),
    Route("/set_file", endpoint=set_file, methods=["POST"]),
    Route("/get_file_name", endpoint=get_file_name, methods=["GET"])
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

app = Starlette(routes=routes, middleware=middleware)