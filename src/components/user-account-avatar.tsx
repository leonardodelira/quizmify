import { Avatar } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import Image from "next/image";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

const UserAccountAvatar = ({ user }: Props) => {
  return (
    <Avatar className="h-9 w-9 relative block">
        <Image
            fill
            src={user.image!}
            alt="profile picture"
            referrerPolicy="no-referrer"
            className="rounded-full"
          />
      <AvatarFallback>
        <span className="sr-only ">{user?.name}</span>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAccountAvatar;
