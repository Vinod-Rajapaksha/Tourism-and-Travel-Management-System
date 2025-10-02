export type Promotion = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
  time: string;
  price: string;
  originalPrice: string;
  discount: string;
  duration: string;
  maxParticipants: number;
  isActive: boolean;
  promotionType: string;
  terms: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CalendarSettings = {
  backgroundImage?: string;
  backgroundOpacity?: number;
  backgroundBlur?: number;
  siteBackgroundImage?: string;
  siteBackgroundOpacity?: number;
  siteBackgroundBlur?: number;
  theme?: 'light' | 'dark' | 'auto';
  customCSS?: string;
};

export type Payment = {
  id: string;
  bookingId?: string;
  customer?: string;
  amount: number;
  currency?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'refunded' | 'failed';
  method?: 'card' | 'cash' | 'bank' | 'wallet';
  packageId?: string;
  packageName?: string;
  packagePrice?: number;
};
