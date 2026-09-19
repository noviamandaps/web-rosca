export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type AdminRole = 'SUPER_ADMIN' | string;

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface Inventory {
  warehouseId: string;
  warehouseName?: string;
  stock: number;
}

export interface Variant {
  id: string;
  productId?: string;
  sku: string;
  colorName?: string;
  colorHex?: string;
  sizeLabel?: string;
  volumeMl?: number;
  weightGram?: number;
  additionalPrice?: number;
  isActive?: boolean;
  inventories?: Inventory[];
  images?: { id: string; url: string; isPrimary?: boolean; sortOrder?: number }[];
}

export interface ProductImageItem {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSelling?: boolean;
  isSale?: boolean;
  images?: ProductImageItem[];
  variants?: Variant[];
  categories?: Category[];
  categoryIds?: string[];
  stock?: number;
  sold?: number;
}

export interface ProductVariantInput {
  sku?: string;
  colorName?: string;
  colorHex?: string;
  sizeLabel?: string;
  volumeMl?: number;
  weightGram?: number;
  additionalPrice?: number;
  isActive?: boolean;
  inventories?: Inventory[];
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryIds?: string[];
  variants?: ProductVariantInput[];
  isActive?: boolean;
}

export type OrderPaymentMethod = 'COD' | 'TRANSFER';

export interface OrderItem {
  id: string;
  productId?: string;
  productName?: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  price: number;
  isEngrave?: boolean;
  engraveText?: string;
  warehouseId?: string;
  warehouseName?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  customerName?: string;
  customerEmail?: string;
  items?: OrderItem[];
  total?: number;
  subtotal?: number;
  shippingCost?: number;
  courierCode?: string;
  courierService?: string;
  trackingNumber?: string;
  paymentMethod?: OrderPaymentMethod;
  createdAt?: string;
  notes?: string;
}

export interface Courier {
  code: string;
  name: string;
}

export interface DashboardSummary {
  totalRevenue?: number;
  totalOrders?: number;
  totalCustomers?: number;
  totalProducts?: number;
  pendingOrders?: number;
  [key: string]: unknown;
}

export interface RevenuePoint {
  date?: string;
  period?: string;
  revenue?: number;
  orders?: number;
}

export interface UsersStat {
  date?: string;
  newUsers?: number;
  totalUsers?: number;
}

export interface TrafficPoint {
  date?: string;
  visits?: number;
  pageViews?: number;
  uniqueVisitors?: number;
}

export interface TopProduct {
  productId?: string;
  name?: string;
  sold?: number;
  revenue?: number;
  stock?: number;
}

export interface UserRow {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CmsSlider {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface LoginResult {
  accessToken?: string;
  token?: string;
  user?: AdminUser;
  requiresOtp?: boolean;
  otpSent?: boolean;
  forceChangePassword?: boolean;
  resetToken?: string;
}

// ponytail: returnStatus enum backend belum terverifikasi penuh — open union, ketat jika enum nyata dikonfirmasi
export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CLOSED' | (string & {});

export interface ReturnItem {
  id: string;
  orderId?: string;
  orderItemId?: string;
  returnStatus: ReturnStatus;
  condition?: string;
  returnType?: string;
  reason?: string;
  customerNotes?: string;
  qcNotes?: string;
  refundAmount?: number;
  returnAwb?: string;
  refundProofUrl?: string;
  createdAt?: string;
}

export interface SaleEntry {
  id: string;
  productId?: string;
  productName?: string;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  discountPercent?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  isSale?: boolean;
  status?: string;
  sold?: number;
  revenue?: number;
  stock?: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code?: string;
  address?: string;
  isActive?: boolean;
  stock?: number;
  products?: number;
}

export interface WarehouseProduct {
  id: string;
  name?: string;
  sku?: string;
  stock?: number;
}

export interface StockMovement {
  id: string;
  variantId?: string;
  sku?: string;
  type?: string;
  quantity?: number;
  warehouseId?: string;
  warehouseName?: string;
  note?: string;
  createdAt?: string;
}

export interface PickList {
  id: string;
  status?: string;
  notes?: string;
  orderIds?: string[];
  items?: { id: string; orderId?: string; orderNumber?: string; productName?: string; quantity?: number; picked?: boolean }[];
  createdAt?: string;
}

export interface StockRequest {
  id: string;
  variantId?: string;
  sku?: string;
  warehouseId?: string;
  quantity?: number;
  status?: string;
  note?: string;
  createdAt?: string;
}

export interface StockOut {
  id: string;
  variantId?: string;
  sku?: string;
  warehouseId?: string;
  quantity?: number;
  reason?: string;
  status?: string;
  createdAt?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  sentAt?: string;
}

export interface AboutUs {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SurveyEntry {
  id: string;
  [key: string]: unknown;
}

export interface Coupon {
  id: string;
  code: string;
  name?: string;
  description?: string;
  discountType?: string;
  shippingDiscountType?: string;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isForNewUser?: boolean;
  requireClaim?: boolean;
  claimLimit?: number;
  isCombinable?: boolean;
  termsAndConditions?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  applicableProvinceIds?: string[];
  imageUrl?: string;
}

export interface Bundle {
  id: string;
  name?: string;
  title?: string;
  price?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface MstVolume {
  id: string;
  value: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface MstBank {
  id: string;
  name: string;
  code?: string;
  sortOrder?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface PendingPickupOrder {
  id: string;
  orderNumber?: string;
  customerName?: string;
  status?: OrderStatus | string;
  warehouseId?: string;
  warehouseName?: string;
  createdAt?: string;
}

export type PickupVehicle = 'MOTOR' | 'VAN' | 'CAR' | (string & {});

export interface PickupPayload {
  pickupDate: string;
  pickupTime: string;
  pickupVehicle: PickupVehicle;
  orders: { orderNo: string }[];
}

export interface LabelOrderBulkPayload {
  orderNos: string[];
}

export interface AnalyticsSummary {
  [key: string]: unknown;
}
