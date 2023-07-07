export class NotificationJobDTO {
  to: string[];
  title: string;
  body: string;
  data: {
    category: string;
  };
}

export class DeviceFavNotifications {
  [k: string]: string[];
}
