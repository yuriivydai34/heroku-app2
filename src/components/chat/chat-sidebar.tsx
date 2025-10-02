import React from "react";
import { 
  Button, 
  Input, 
  Tabs, 
  Tab, 
  Avatar, 
  Badge, 
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  CheckboxGroup
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useChatContext } from "@/context/chat-context";
import { useUserContext } from "@/context/user-context";
import { ChatRoom } from "@/types";
import { useTranslations } from "next-intl";

export const ChatSidebar: React.FC = () => {
  const t = useTranslations("ChatSidebar");
  
  const { 
    rooms, 
    userStatuses, 
    activeRoomId, 
    activeDirectUserId,
    setActiveRoom, 
    setActiveDirectUser,
    getUnreadCount,
    createRoom,
    getCurrentUserId
  } = useChatContext();

  const { users } = useUserContext();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("rooms");
  const [newRoomName, setNewRoomName] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  
  const { 
    isOpen: isCreateRoomOpen, 
    onOpen: onOpenCreateRoom, 
    onOpenChange: onOpenCreateRoomChange 
  } = useDisclosure();
  
  const currentUserId = getCurrentUserId();
  
  // Filter rooms by search query
  const filteredRooms = React.useMemo(() => {
    return rooms
      .filter(room => !room.isDirectMessage) // Only show group rooms
      .filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [rooms, searchQuery]);
  
  // Filter users by search query
  const filteredUsers = React.useMemo(() => {
    return users
      .filter(user => user.id !== currentUserId) // Don't show current user
      .filter(user => 
        user.UserProfile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.UserProfile?.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, currentUserId]);
  
  const getUserStatus = (userId: number) => {
    const status = userStatuses.find(s => s.userId === userId);
    return status?.status || 'offline';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'busy': return 'danger';
      default: return 'default';
    }
  };
  
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    
    try {
      const memberIds = selectedMembers.map(id => parseInt(id));
      const newRoom = await createRoom(newRoomName.trim(), memberIds);
      
      // Reset form
      setNewRoomName("");
      setSelectedMembers([]);
      
      // Close modal
      onOpenCreateRoomChange(false);
      
      // Set the new room as active
      setActiveRoom(newRoom.id);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };
  
  return (
    <div className="w-72 flex-shrink-0 border-r border-default-200 flex flex-col">
      <div className="p-3 border-b border-default-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">{t("chat")}</h2>
          <Button 
            isIconOnly 
            size="sm" 
            variant="flat" 
            color="primary"
            onPress={onOpenCreateRoom}
          >
            <Icon icon="lucide:plus" />
          </Button>
        </div>
        
        <Input
          placeholder={t("searchPlaceholder")}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          size="sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={setSelectedTab as any}
        classNames={{
          tabList: "w-full px-2 border-b border-default-200",
          cursor: "bg-primary",
          tab: "h-10",
        }}
      >
        <Tab key="rooms" title="Rooms" />
        <Tab key="direct" title="Direct" />
      </Tabs>
      
      <div className="flex-grow overflow-y-auto scrollbar-hidden">
        {selectedTab === "rooms" ? (
          filteredRooms.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredRooms.map((room) => (
                <Button
                  key={room.id}
                  className="w-full justify-start h-auto py-2"
                  variant={activeRoomId === room.id.toString() ? "flat" : "light"}
                  color={activeRoomId === room.id.toString() ? "primary" : "default"}
                  onPress={() => setActiveRoom(room.id.toString())}
                  startContent={
                    <div className="relative">
                      <Avatar
                        name={room.name}
                        size="sm"
                        className="bg-primary-100"
                      />
                      {getUnreadCount(room.id.toString()) > 0 && (
                        <Badge
                          content={getUnreadCount(room.id.toString())}
                          color="danger"
                          size="sm"
                          className="absolute -top-1 -right-1"
                        />
                      )}
                    </div>
                  }
                >
                  <div className="text-left truncate">
                    <p className="font-medium truncate">{room.name}</p>
                    <p className="text-xs text-default-500 truncate">
                      {room.members.length} {t('members')}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-default-400">
              {searchQuery ? "No rooms found" : "No rooms available"}
            </div>
          )
        ) : (
          filteredUsers.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredUsers.map((user) => {
                const status = getUserStatus(user.id);
                
                return (
                  <Button
                    key={user.id}
                    className="w-full justify-start h-auto py-2"
                    variant={activeDirectUserId === user.id ? "flat" : "light"}
                    color={activeDirectUserId === user.id ? "primary" : "default"}
                    onPress={() => setActiveDirectUser(user.id)}
                    startContent={
                      <div className="relative">
                        <Avatar
                          name={user.UserProfile?.name}
                          src={user.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
                          size="sm"
                        />
                        <Badge
                          className="absolute -bottom-1 -right-1 border-2 border-background"
                          color={getStatusColor(status)}
                          size="sm"
                          variant="solid"
                          isOneChar
                        />
                      </div>
                    }
                  >
                    <div className="text-left truncate">
                      <p className="font-medium truncate">{user.UserProfile?.name}</p>
                      <p className="text-xs text-default-500 truncate">
                        {user.UserProfile?.role}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-default-400">
              {searchQuery ? t("noUsersFound") : t("noUsersAvailable")}
            </div>
          )
        )}
      </div>
      
      {/* Create Room Modal */}
      <Modal isOpen={isCreateRoomOpen} onOpenChange={onOpenCreateRoomChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t("createNewRoom")}</ModalHeader>
              <ModalBody>
                <Input
                  label={t("roomName")}
                  placeholder={t("enterRoomName")}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                
                <Divider className="my-4" />

                <p className="text-sm font-medium mb-2">{t("selectMembers")}</p>
                <CheckboxGroup
                  value={selectedMembers}
                  onValueChange={setSelectedMembers}
                  className="gap-1"
                >
                  {users
                    .filter(user => user.id !== currentUserId)
                    .map((user) => (
                      <Checkbox key={user.id} value={user.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={user.UserProfile?.name}
                            src={user.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
                            size="sm"
                          />
                          <span>{user.UserProfile?.name}</span>
                        </div>
                      </Checkbox>
                    ))}
                </CheckboxGroup>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateRoom}
                  isDisabled={!newRoomName.trim() || selectedMembers.length === 0}
                >
                  {t("createRoom")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};