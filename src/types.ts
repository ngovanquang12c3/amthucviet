export type Language = 'en' | 'vi' | 'tl';

export interface MenuItem {
  id: string;
  nameEn: string;
  nameVi: string;
  nameTl: string;
  price: number; // in PHP
  originalPrice?: number; // for discounts
  category: string;
  image: string;
  descriptionEn: string;
  descriptionVi: string;
  descriptionTl: string;
  rating: number;
  reviewsCount: number;
  isSpicy: boolean;
  isGlutenFree: boolean;
  isVegetarian?: boolean;
  preparationTime: number; // in minutes
  ingredientsEn: string[];
  ingredientsVi: string[];
  ingredientsTl: string[];
  isAvailable: boolean;
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  language: Language;
  reply?: string; // Restaurant owner's reply
}

export interface Order {
  id: string;
  items: {
    menuItemId: string;
    nameEn: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryFee: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerDistrict: string; // e.g. BGC, Makati, Quezon City, etc.
  paymentMethod: 'card' | 'gcash' | 'bank';
  paymentDetails?: {
    cardNumber?: string;
    gcashNumber?: string;
    bankRef?: string;
  };
  paymentStatus: 'pending' | 'paid';
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Dictionary {
  // Navigation
  home: string;
  menu: string;
  about: string;
  reviews: string;
  location: string;
  admin: string;
  cart: string;
  favorites: string;
  
  // App Titles & Hero
  heroTitle: string;
  heroSub: string;
  heroBtn: string;
  vietcuisine: string;
  operatingIn: string;
  tagline: string;
  
  // Menu Section
  searchPlaceholder: string;
  all: string;
  pho: string;
  banhmi: string;
  buncha: string;
  springrolls: string;
  drinks: string;
  desserts: string;
  spicy: string;
  glutenFree: string;
  vegetarian: string;
  prepTime: string;
  mins: string;
  addToCart: string;
  addedToCart: string;
  ingredients: string;
  soldOut: string;
  
  // Reviews
  customerReviews: string;
  writeReview: string;
  yourName: string;
  yourRating: string;
  yourReview: string;
  submitReview: string;
  reviewsSuccess: string;
  ownerReply: string;
  
  // Cart & Checkout
  yourCart: string;
  cartEmpty: string;
  checkout: string;
  subtotal: string;
  deliveryFeeLabel: string;
  total: string;
  notesLabel: string;
  notesPlaceholder: string;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  districtLabel: string;
  paymentMethodLabel: string;
  creditCard: string;
  bankTransfer: string;
  placeOrder: string;
  processingOrder: string;
  orderSuccess: string;
  orderNumber: string;
  orderSummary: string;
  
  // Map / Location
  findUs: string;
  ourAddress: string;
  hours: string;
  weekdays: string;
  weekends: string;
  getDirections: string;
  selectDistrict: string;
  estDelivery: string;
  
  // Chat Widget
  aiChatTitle: string;
  aiChatSub: string;
  aiChatPlaceholder: string;
  aiChatWelcome: string;
  
  // Admin Panel / CMS
  adminDashboard: string;
  salesSummary: string;
  totalSales: string;
  activeOrders: string;
  pendingReviews: string;
  revenueChart: string;
  popularDishesChart: string;
  orderManagement: string;
  menuManagement: string;
  addDish: string;
  editDish: string;
  dishNameEn: string;
  dishNameVi: string;
  dishNameTl: string;
  dishPrice: string;
  dishCategory: string;
  dishDescription: string;
  saveChanges: string;
  deleteDish: string;
  statusPending: string;
  statusProcessing: string;
  statusCompleted: string;
  statusCancelled: string;
  updateStatus: string;
  replyToReview: string;
  writeReplyPlaceholder: string;
  sendReply: string;
  realtimeAlert: string;
  
  // General / Privacy
  privacyNotice: string;
  privacyDetails: string;
  agreeTerms: string;
}
