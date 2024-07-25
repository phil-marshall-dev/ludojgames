import json

from channels.generic.websocket import AsyncWebsocketConsumer

class LudojConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        handler = getattr(self, f"handle_{action}", None)
        if handler:
            await handler(data.get('payload'))
        else:
            await self.send_error(f"Unknown action '{action}'")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def broadcast(self, type, message=None):
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "handle_message", "message_type": type, "message": message},
        )

    async def send_error(self, error):
        await self.send_message('error', error)

    async def send_message(self, type, message):
        await self.send(text_data=json.dumps({"type": type, "message": message}))

    async def handle_message(self, event):
        message_type = event["message_type"]
        message = event["message"]
        await self.send_message(message_type, message)
