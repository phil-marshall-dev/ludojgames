from django.forms import ValidationError
from .ludoj_consumer import LudojConsumer
from channels.db import database_sync_to_async

from ..models import Chat, Game


class ChatConsumer(LudojConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.game_name = self.scope["url_route"]["kwargs"]["game_name"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.group_name = f"chat_{self.game_name}_{self.game_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_existing_chats()

    async def send_existing_chats(self):
        # Query the existing chats for the game
        chats = await self.get_existing_chats(self.game_id)

        # Format the chats
        chat_list = []
        for chat in chats:
            chat_list.append({
                "id": chat.id,
                "author": {"id": chat.author.id, "username": chat.author.username},
                "text": chat.text,
                "createdAt": chat.created_at.isoformat(),
            })

        # Send the existing chats to the WebSocket client
        await self.send_message('existing', chat_list)

    @database_sync_to_async
    def get_existing_chats(self, game_id):
        # Retrieve chats for the specified game
        return list(Chat.objects.filter(game_id=game_id).select_related('author').order_by('created_at'))
    

    @database_sync_to_async
    def validate_and_create_chat(self, game_id, user_id, payload):
        try:
            game = Game.objects.get(id=game_id)
            if user_id not in [game.player_1.id, game.player_2.id]:
                raise ValidationError("User does not belong to this game")
            chat = Chat.objects.create(author_id=user_id, game_id=game_id, text=payload)
            return chat
        except Game.DoesNotExist:
            raise ValidationError("Invalid game ID")

    async def handle_create(self, payload):
        if not payload:
            await self.send_error("No chat text provided")
            return
        try:
            chat = await self.validate_and_create_chat(
                self.game_id, self.user.id, payload
            )
            await self.broadcast(
                "created",
                {
                    "id": chat.id,
                    "author": {"id": self.user.id, "username": self.user.username},
                    "text": chat.text,
                    "createdAt": chat.created_at.isoformat(),
                },
            )
        except ValidationError as e:
            await self.send_error(str(e))
