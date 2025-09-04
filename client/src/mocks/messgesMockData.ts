import { Message } from "@/types/chat";

export const messagesMockData: Message[] = [
  {
    id: "1",
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    time: "8:00 PM",
    isOwnMessage: true,
    sender: {
      id: "1212",
      name: "21212",
    },
  },
  {
    id: "2",
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    time: "8:00 PM",
    isOwnMessage: false,
    sender: {
      id: "1212",
      name: "21212",
    },
  },
  {
    id: "3",
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    time: "8:00 PM",
    isOwnMessage: true,
    sender: {
      id: "1212",
      name: "21212",
    },
  },
  {
    id: "4",
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    time: "8:00 PM",
    isOwnMessage: false,
    sender: {
      id: "1212",
      name: "21212",
    },
  },
];
