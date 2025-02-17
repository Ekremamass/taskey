import { User, Task, Role } from "@prisma/client";

const placeholderUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    emailVerified: new Date("2025-01-01T00:00:00.000Z"),
    image: "https://example.com/image1.jpg",
    role: Role.USER,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    emailVerified: new Date("2025-01-02T00:00:00.000Z"),
    image: "https://example.com/image2.jpg",
    role: Role.ADMIN,
    createdAt: new Date("2025-01-02T00:00:00.000Z"),
    updatedAt: new Date("2025-01-02T00:00:00.000Z"),
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    emailVerified: new Date("2025-01-03T00:00:00.000Z"),
    image: "https://example.com/image3.jpg",
    role: Role.USER,
    createdAt: new Date("2025-01-03T00:00:00.000Z"),
    updatedAt: new Date("2025-01-03T00:00:00.000Z"),
  },
];

const placeholderTasks: Task[] = [];

placeholderUsers.forEach((user, index) => {
  for (let i = 1; i <= 10; i++) {
    placeholderTasks.push({
      id: index * 10 + i,
      createdAt: new Date(`2025-01-${index + 1}T00:00:00.000Z`),
      updatedAt: new Date(`2025-01-${index + 1}T00:00:00.000Z`),
      published: i % 2 === 0,
      title: `Task ${index * 10 + i}`,
      userId: user.id,
    });
  }
});

export { placeholderUsers, placeholderTasks };
