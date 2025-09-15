import { Card, CardHeader, CardBody } from "@heroui/react";
import { Avatar } from "@heroui/react";
import { Badge } from "@heroui/react";

interface UserData {
  id: string;
  username: string;
}

const UsersList = ({ users }: { users: UserData[] }) => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-primary">Список користувачів</h2>
        </CardHeader>
        <CardBody>
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
              <li key={user.id} className="flex items-center py-4">
                <Avatar name={user.username} size="md" className="mr-4" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{user.username}</span>
                  <Badge variant="solid" className="ml-2">
                    ID: {user.id}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default UsersList;