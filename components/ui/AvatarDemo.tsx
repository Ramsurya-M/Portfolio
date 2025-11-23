import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  export function AvatarDemo() {
    return (
      <Avatar>
        <AvatarImage src="/Avatar.png" alt="avatar" />
        <AvatarFallback>RM</AvatarFallback>
      </Avatar>
    )
  }
  