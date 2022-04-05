export class Room {
    name: string;
    users : string[] = [];

    public constructor(roomName: string) {
        this.name = roomName;
    }
}