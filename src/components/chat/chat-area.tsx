import React from "react";
import {
  Avatar,
  Button,
  Textarea,
  Spinner,
  Divider,
  Badge,
  Chip,
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
import { format } from "date-fns";
import { useChatContext } from "@/context/chat-context";
import { useFileContext } from "@/context/file-context";
import { Message, UploadedFile } from "@/types";
import { useUserContext } from "@/context/user-context";
import { useTranslations } from "next-intl";

export const ChatArea: React.FC = () => {
  const {
    messages,
    rooms,
    activeRoomId,
    activeDirectUserId,
    loading,
    error,
    sendMessage,
    getCurrentUserId
  } = useChatContext();

  const t = useTranslations("ChatArea");

  const {
    files,
    selectedFiles,
    setSelectedFiles,
    clearSelectedFiles,
    toggleFileSelection
  } = useFileContext();

  const { users } = useUserContext();

  const [messageText, setMessageText] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  const {
    isOpen: isFileModalOpen,
    onOpen: onFileModalOpen,
    onOpenChange: onFileModalOpenChange
  } = useDisclosure();

  const {
    isOpen: isRoomInfoOpen,
    onOpen: onRoomInfoOpen,
    onOpenChange: onRoomInfoOpenChange
  } = useDisclosure();

  // Get active room or direct message user
  const activeRoom = React.useMemo(() => {
    if (activeRoomId) {
      return rooms.find(room => String(room.id) === String(activeRoomId));
    }
    return null;
  }, [activeRoomId, rooms]);

  const activeUser = React.useMemo(() => {
    if (activeDirectUserId) {
      return users.find(user => user.id === activeDirectUserId);
    }
    return null;
  }, [activeDirectUserId]);

  // Get chat title and members
  const chatTitle = React.useMemo(() => {
    if (activeRoom) {
      return activeRoom.name;
    } else if (activeUser) {
      return activeUser.UserProfile?.name;
    }
    return "Chat";
  }, [activeRoom, activeUser]);

  const chatMembers = React.useMemo(() => {
    if (activeRoom) {
      return activeRoom.members.map((id: number) =>
        users.find(user => user.id === id)
      ).filter(Boolean);
    }
    return [];
  }, [activeRoom]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() && selectedFiles.length === 0) return;

    try {
      await sendMessage(messageText, selectedFiles.length > 0 ? selectedFiles : undefined);
      setMessageText("");
    } catch (error) {
      console.error(t("sendMessageFailed"), error);
    }
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return format(date, "h:mm a");
      } else {
        return format(date, "MMM d, h:mm a");
      }
    } catch {
      return timestamp;
    }
  };

  // Group messages by sender for better UI
  const groupedMessages = React.useMemo(() => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];
    let currentSenderId: number | null = null;

    messages.forEach((message: Message) => {
      if (message.senderId !== currentSenderId) {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
        currentSenderId = message.senderId;
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  const removeSelectedFile = (file: UploadedFile) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  if (error) {
    return (
      <div className="p-4 text-danger">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b border-default-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            name={chatTitle}
            src={activeUser?.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${activeUser?.id}`}
            size="sm"
          />
          <div>
            <h3 className="font-medium">{chatTitle}</h3>
            {activeRoom && !activeRoom.isDirectMessage && (
              <p className="text-xs text-default-500">
                {chatMembers.length} {t(chatMembers.length !== 1 ? 'members' : 'member')}
              </p>
            )}
            {activeUser && (
              <p className="text-xs text-default-500">
                {activeUser.UserProfile?.role}
              </p>
            )}
          </div>
        </div>

        {activeRoom && !activeRoom.isDirectMessage && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onRoomInfoOpen}
          >
            <Icon icon="lucide:info" />
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto scrollbar-hidden">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
          </div>
        ) : groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-default-400">
            <Icon icon="lucide:message-circle" width={48} height={48} className="mb-2" />
            <p>{t("noMessages")}</p>
            <p className="text-sm">{t("startConversation")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedMessages.map((group, groupIndex) => {
              const firstMessage = group[0];
              const sender = users.find(u => u.id === firstMessage.senderId);
              const isCurrentUser = firstMessage.senderId === currentUserId;

              return (
                <div key={groupIndex} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[80%]`}>
                    {!isCurrentUser && (
                      <Avatar
                        name={sender?.UserProfile?.name || `User #${firstMessage.senderId}`}
                        src={activeUser?.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${firstMessage.senderId}`}
                        className="mt-1"
                        size="sm"
                      />
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {!isCurrentUser && (
                        <span className="text-xs font-medium mb-1">
                          {sender?.UserProfile?.name || `User #${firstMessage.senderId}`}
                        </span>
                      )}

                      <div className="space-y-1">
                        {group.map((message, messageIndex) => (
                          <div key={message.id} className="flex flex-col">
                            <div
                              className={`px-3 py-2 rounded-lg ${isCurrentUser
                                  ? 'bg-primary text-white rounded-tr-none'
                                  : 'bg-default-100 rounded-tl-none'
                                }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>

                              {message.files && message.files.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.files.map((file) => (
                                    <div
                                      key={file.id}
                                      className={`flex items-center gap-2 p-2 rounded ${isCurrentUser ? 'bg-primary-600' : 'bg-default-200'
                                        }`}
                                    >
                                      <Icon
                                        icon={getFileIcon(file.mimetype)}
                                        className={isCurrentUser ? 'text-white' : 'text-default-600'}
                                        width={16}
                                        height={16}
                                      />
                                      <span
                                        className={`text-xs flex-grow truncate ${isCurrentUser ? 'text-white' : 'text-default-800'
                                          }`}
                                        title={file.originalName}
                                      >
                                        {file.originalName}
                                      </span>
                                      <span
                                        className={`text-xs ${isCurrentUser ? 'text-white/80' : 'text-default-500'
                                          }`}
                                      >
                                        {formatFileSize(file.size)}
                                      </span>
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={isCurrentUser ? 'text-white' : 'text-primary'}
                                      >
                                        <Icon icon="lucide:external-link" width={14} height={14} />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <span
                              className={`text-xs text-default-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'
                                }`}
                            >
                              {formatMessageTime(message.timestamp)}
                              {isCurrentUser && (
                                <span className="ml-1">
                                  {message.isRead ? (
                                    <Icon icon="lucide:check-check" className="inline" width={12} height={12} />
                                  ) : (
                                    <Icon icon="lucide:check" className="inline" width={12} height={12} />
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-default-200">
        {selectedFiles.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedFiles.map((file) => (
                <Chip
                  key={file.id}
                  onClose={() => removeSelectedFile(file)}
                  variant="flat"
                  color="default"
                  avatar={<Icon icon={getFileIcon(file.mimetype)} />}
                  size="sm"
                >
                  {file.originalName}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            onPress={onFileModalOpen}
          >
            <Icon icon="lucide:paperclip" />
          </Button>

          <Textarea
            placeholder={t("typeMessage")}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            minRows={1}
            maxRows={4}
            className="flex-grow"
          />

          <Button
            isIconOnly
            color="primary"
            onPress={handleSendMessage}
            isDisabled={!messageText.trim() && selectedFiles.length === 0}
          >
            <Icon icon="lucide:send" />
          </Button>
        </div>
      </div>

      {/* File Selection Modal */}
      <Modal isOpen={isFileModalOpen} onOpenChange={onFileModalOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t("attachFiles")}</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-sm">{t("selectFiles")}</p>

                  {files.length === 0 ? (
                    <div className="text-center p-8 bg-default-50 rounded-medium">
                      <Icon icon="lucide:file" className="mx-auto mb-2 text-default-400" width={32} height={32} />
                      <p className="text-default-600">{t("noFilesAvailable")}</p>
                      <p className="text-default-400 text-sm">{t("uploadFilesInFileManager")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {files.map((file) => {
                        const isSelected = selectedFiles.some(f => f.id === file.id);

                        return (
                          <div
                            key={file.id}
                            className={`border rounded-medium p-3 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary-50' : 'border-default-200'
                              }`}
                            onClick={() => toggleFileSelection(file)}
                          >
                            <Checkbox
                              isSelected={isSelected}
                              onValueChange={() => toggleFileSelection(file)}
                            />

                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon
                                  icon={getFileIcon(file.mimetype)}
                                  className="text-default-600"
                                  width={18}
                                  height={18}
                                />
                                <span className="font-medium truncate" title={file.originalName}>
                                  {file.originalName}
                                </span>
                              </div>

                              <div className="text-xs text-default-400">
                                {formatFileSize(file.size)} • {file.mimetype.split('/')[1].toUpperCase()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between w-full">
                  <div className="text-sm">
                    {selectedFiles.length} {t("file")} {selectedFiles.length !== 1 ? t("s") : ''} {t("selected")}
                  </div>
                  <Button variant="flat" onPress={onClose}>
                    {t("done")}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Room Info Modal */}
      {activeRoom && (
        <Modal isOpen={isRoomInfoOpen} onOpenChange={onRoomInfoOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>{activeRoom.name}</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">{t("createdBy")}</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const creator = users.find(u => u.id === activeRoom.createdBy);
                          return (
                            <>
                              <Avatar
                                name={creator?.UserProfile?.name || `${t("userPlaceholder")} #${activeRoom.createdBy}`}
                                src={creator?.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${activeRoom.createdBy}`}
                                size="sm"
                              />
                              <span>{creator?.UserProfile?.name || `${t("userPlaceholder")} #${activeRoom.createdBy}`}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <p className="text-sm font-medium mb-2">{t("members")} ({chatMembers.length})</p>
                      <div className="space-y-2">
                        {chatMembers
                          .filter((member): member is typeof users[number] => Boolean(member))
                          .map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar
                                  name={member.UserProfile?.name || `User #${member.id}`}
                                  src={member.UserProfile?.avatarUrl || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${member.id}`}
                                  size="sm"
                                />
                                <div>
                                  <p className="text-sm">{member.UserProfile?.name || `User #${member.id}`}</p>
                                  <p className="text-xs text-default-500">{member.UserProfile?.role}</p>
                                </div>
                              </div>

                              {member.id === activeRoom.createdBy && (
                                <Badge color="primary" variant="flat" size="sm">
                                  {t('creatorBadge')}
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    {t("close")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

// Helper function to get appropriate icon based on file type
function getFileIcon(mimetype: string): string {
  if (mimetype.startsWith("image/")) {
    return "lucide:image";
  } else if (mimetype === "application/pdf") {
    return "lucide:file-text";
  } else if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) {
    return "lucide:file-spreadsheet";
  } else if (mimetype.includes("word") || mimetype.includes("document")) {
    return "lucide:file-text";
  } else if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) {
    return "lucide:file-presentation";
  } else {
    return "lucide:file";
  }
}