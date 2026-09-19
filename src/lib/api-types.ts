export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ponytail: Paginated<T> masih dipakai modul yang shape-nya belum terverifikasi (products, returns, warehouse)
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'READY_TO_SHIP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED';

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
  productName?: string;
  variantInfo?: string;
  unitPrice?: number;
  quantity: number;
  subtotal?: number;
  isEngrave?: boolean;
  engraveText?: string;
  imageUrl?: string;
}

export interface OrderUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  membershipLevel?: string;
}

export interface OrderPayment {
  id: string;
  status: string;
  paymentMethod?: string;
  paymentChannel?: string;
  amount?: number;
  expiredAt?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  statusLabel?: string;
  user?: OrderUser;
  warehouse?: { id: string; name: string } | null;
  subtotal?: number;
  shippingCost?: number;
  discountAmount?: number;
  serviceFee?: number;
  totalAmount?: number;
  courierCode?: string | null;
  courierService?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  itemCount?: number;
  payment?: OrderPayment | null;
  customerName?: string;
  total?: number;
}

export interface Courier {
  code: string;
  name: string;
}

export interface DashboardSummary {
  revenue: { total: number; thisMonth: number; growthRate: number; avgOrderValue: number };
  netSales: { total: number; thisMonth: number; serviceFees: number; refunds: number };
  gmv: { total: number; thisMonth: number };
  unitSold: { total: number; thisMonth: number };
  orders: {
    total: number;
    thisMonth: number;
    today: number;
    pending: number;
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    failed: number;
    conversionRate: number;
  };
  users: {
    total: number;
    thisMonth: number;
    today: number;
    active: number;
    totalBuyers: number;
    repeatCustomers: number;
    buyerConversionRate: number;
  };
  products: { total: number; lowStock: number; lowStockThreshold: number; outOfStock: number };
  reviews: { total: number; thisMonth: number; avgRating: number };
  abandonedCarts: { total: number; thisMonth: number; rate: number };
}

export interface RevenuePoint {
  month?: string;
  year?: number;
  revenue?: number;
  orderCount?: number;
  avgOrderValue?: number;
}

export interface UsersStat {
  month?: number;
  year?: number;
  count?: number;
}

export interface TrafficPoint {
  date?: string;
  visits?: number;
  pageViews?: number;
  uniqueVisitors?: number;
}

export interface TopProductItem {
  variantId?: string | null;
  variantLabel?: string | null;
  variantSku?: string | null;
  variantPrice?: number;
  totalSold: number;
  revenue: number;
  totalStock?: number;
  lastSoldAt?: string | null;
  product?: {
    productId: string;
    productName: string;
    productSlug?: string;
    productImage?: string | null;
    basePrice?: number;
    salePrice?: number | null;
  };
}

export interface TopProductsResult {
  period?: string;
  startDate?: string;
  endDate?: string;
  generatedAt?: string;
  products: TopProductItem[];
}

export interface CustomerRow {
  id: string;
  name?: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  isActive?: boolean;
  membershipLevel?: string;
  points?: number;
  createdAt?: string;
  totalOrders?: number;
  totalSpending?: number;
  averageOrderValue?: number;
  lastOrderDate?: string | null;
}

export interface AbandonedCart {
  cartId: string;
  userId?: string | null;
  user?: { id: string; name?: string; email?: string; phone?: string | null } | null;
  itemCount: number;
  totalAmount: number;
  daysAbandoned: number;
  lastActivity?: string;
}

export interface AbandonedCartsResult {
  summary: { totalAbandonedCarts: number; totalAbandonedAmount: number; avgDaysAbandoned: number };
  carts: AbandonedCart[];
  pagination: Pagination;
}

export type UserRow = {
  id: string;
  email: string;
  name?: string;
  phone?: string | null;
  gender?: string | null;
  city?: string | null;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  membershipLevel?: string;
  // ponytail: Decimal bisa string di JSON (readme §5.4) — Number() di FE
  totalSpending?: number | string;
  points?: number | string;
  createdAt?: string;
};

export type UsersListResult = { users: UserRow[]; pagination: Pagination };

export type OrdersListResult = { orders: Order[]; pagination: Pagination };

// --- Sales (flat, key success, pagination FLAT) ---
export type SaleProductStatus = 'not_started' | 'active' | 'ended' | 'no_sale_set';

export interface SaleProduct {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  basePrice?: number;
  salePrice?: number | null;
  saleStartDate?: string | null;
  saleEndDate?: string | null;
  isSale?: boolean;
  saleStatus?: SaleProductStatus;
  daysRemaining?: number | null;
  discountPercent?: number | null;
  images?: { id: string; imageUrl: string; isPrimary?: boolean }[];
}

export type SalesListResult = {
  products: SaleProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface SaleVariant {
  id: string;
  productId?: string;
  productName?: string;
  sku?: string;
  colorName?: string | null;
  sizeLabel?: string | null;
  volumeMl?: number | null;
  additionalPrice?: number;
  basePrice?: number;
  salePrice?: number | null;
  discountPercent?: number | null;
  isSale?: boolean;
  saleStartDate?: string | null;
  saleEndDate?: string | null;
  saleStatus?: SaleProductStatus;
  daysRemaining?: number | null;
  salePurchaseLimit?: number | null;
  salePurchaseCount?: number;
  salePurchaseLimitPerUser?: number | null;
  saleQuotaRemaining?: number | null;
}

export type SaleVariantsListResult = {
  variants: SaleVariant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface SaleVariantOverviewRow {
  id: string;
  productId?: string;
  product?: { id: string; name: string; slug?: string; sku?: string; basePrice?: number; imageUrl?: string | null };
  variant?: { sku?: string; colorName?: string | null; sizeLabel?: string | null; volumeMl?: number | null; imageUrl?: string | null };
  pricing?: { basePrice?: number; additionalPrice?: number; effectivePrice?: number; salePrice?: number | null; discountPercent?: number | null };
  sale?: { isSale?: boolean; saleStatus?: SaleProductStatus; daysRemaining?: number | null; saleStartDate?: string | null; saleEndDate?: string | null; salePurchaseLimit?: number | null; salePurchaseCount?: number; salePurchaseLimitPerUser?: number | null; saleQuotaRemaining?: number | null };
  stock?: { stockQuantity?: number; reservedStock?: number; availableStock?: number };
  metrics?: { soldQuantity?: number; revenue?: number; orderCount?: number; returnCount?: number; returnRate?: number };
  isActive?: boolean;
}

export type SaleVariantsOverviewResult = {
  variants: SaleVariantOverviewRow[];
  summary?: { totalVariants?: number; onSaleCount?: number; totalSold?: number; totalRevenue?: number; totalReturns?: number; averageReturnRate?: number };
  pagination: Pagination;
  period?: { startDate?: string; endDate?: string };
  comparison?: { period?: { startDate?: string; endDate?: string }; summary?: { totalSold?: number; totalRevenue?: number; totalReturns?: number } } | null;
};

export interface SaleStatistics {
  totalSaleProducts?: number;
  activeSales?: number;
  expiredSales?: number;
  upcomingSales?: number;
}

// --- User-side (storefront) ---
export interface ProductImageRow {
  id?: string;
  url?: string;
  imageUrl?: string;
  altText?: string;
  isPrimary?: boolean;
  isLifestyle?: boolean;
  sortOrder?: number;
  description?: string;
}

export interface PublicVariant {
  id: string;
  sku?: string;
  colorName?: string | null;
  colorHex?: string | null;
  sizeLabel?: string | null;
  volumeMl?: number | null;
  additionalPrice?: number | string;
  price?: number | string;
  salePrice?: number | string | null;
  stock?: number;
  stockQuantity?: number;
  isActive?: boolean;
  imageUrl?: string | null;
  images?: ProductImageRow[];
}

// ponytail: mapping ke shape nyata staging (audit readme-be-audit-user.md)
export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  shortDescription?: string | null;
  basePrice?: number | string;
  price?: number | string;
  originalPrice?: number | string | null;
  salePrice?: number | string | null;
  isSale?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSelling?: boolean;
  images?: ProductImageRow[];
  homepageImage?: ProductImageRow | null;
  catalogImage?: ProductImageRow | null;
  bestSellerImage?: ProductImageRow | null;
  variants?: PublicVariant[];
  productCategories?: { id?: string; name?: string; category?: { name?: string } }[];
  categories?: { id: string; name: string }[];
  category?: string;
  stock?: number;
  sold?: number;
}

export interface CartItemRow {
  id: string;
  productId?: string;
  variantId?: string;
  productName?: string;
  variantLabel?: string;
  unitPrice?: number;
  price?: number;
  quantity: number;
  subtotal?: number;
  image?: string | null;
  imageUrl?: string | null;
  slug?: string;
  isEngrave?: boolean;
  engraveText?: string | null;
}

export type CartResult = {
  items?: CartItemRow[];
  cartItems?: CartItemRow[];
  summary?: { subtotal?: number; itemCount?: number };
};

export interface Address {
  id?: string;
  label?: string;
  recipientName: string;
  phone: string;
  province: string;
  provinceId?: string;
  city: string;
  cityId?: string;
  district?: string;
  districtId?: string;
  subdistrict?: string;
  subdistrictId?: string;
  postalCode: string;
  fullAddress: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  komerceDestinationId?: string;
  isDefault?: boolean;
}

export interface ReviewRow {
  id: string;
  name?: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
  images?: { id: string; imageUrl: string }[];
  reply?: string | null;
}

export interface ReviewInput {
  productId: string;
  orderItemId: string;
  rating: number;
  comment: string;
}

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
}

export interface PaymentResult {
  id?: string;
  paymentId?: string;
  status?: string;
  paymentMethod?: string;
  paymentChannel?: string;
  paymentCode?: string | null;
  qrCodeUrl?: string | null;
  amount?: number;
  expiredAt?: string | null;
  providerPaymentId?: string | null;
}

export interface BankRow {
  id: string;
  name: string;
  code?: string;
  imageUrl?: string;
}

export interface CmsSlider {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  mobileImageUrl?: string | null;
  buttonText?: string;
  ctaText?: string;
  linkUrl?: string;
  ctaLink?: string;
  textColor?: string | null;
  videoUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

// shape nyata GET /cms/sliders → { sliders, pagination } (audit staging)
export interface CmsSlidersResult {
  sliders: CmsSlider[];
  pagination?: Pagination;
}

// shape nyata GET /products → { products, pagination }
export interface ProductsListResult {
  products: PublicProduct[];
  pagination?: Pagination;
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

export interface SaleEntry extends SaleVariant {
  variantLabel?: string;
  price?: number;
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
