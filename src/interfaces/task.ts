interface TaskData {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  usersIdAssociate: number[];
  userIdSupervisor: number;
}