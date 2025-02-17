import React from "react";

const userCard = () => {
  return (
    <div>
      <Card key={user.id}>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{user.email}</CardDescription>
        </CardContent>
        <CardFooter>
          <Link
            href={`/users/${user.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            View
          </Link>
        </CardFooter>
      </Card>
      ;
    </div>
  );
};

export default userCard;
