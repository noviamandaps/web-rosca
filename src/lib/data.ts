// Dummy data untuk products

export interface ProductImage {
  url: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  imageDescriptions?: string[];
  category: string;
  badge?: 'NEW' | 'BEST' | 'SALE';
  stock: number;
  sold: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Slider {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  sales: number;
  commission: number;
  status: 'Active' | 'Pending' | 'Suspended';
  joinDate: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  shippingMethod?: string;
  paymentMethod?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

// Rosca Products from Shopee - Updated with Detailed Descriptions & Proper Badges
export const products: Product[] = [
  {
    id: '1',
    name: 'Rosca OzzyJug',
    slug: 'rosca-ozzyjug',
    description: 'Tumbler stainless steel premium 770ml-1200ml dengan double wall vacuum insulation. Tahan panas hingga 12 jam dan dingin hingga 24 jam. Desain ergonomis yang nyaman digenggam, cocok untuk aktivitas sehari-hari, kerja, maupun traveling. Bahan food grade stainless steel 18/8 yang aman dan bebas BPA.',
    price: 289000,
    images: ['/products/rosca-1.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 100,
  },
  {
    id: '2',
    name: 'Rosca PoppyJug',
    slug: 'rosca-poppyjug',
    description: 'Tumbler stainless 1 Liter dengan desain slim dan elegant. Double wall insulation menjaga suhu minuman tetap panas atau dingin hingga 8 jam. Bentuknya yang ramping mudah masuk ke tas dan cup holder mobil. Available dalam berbagai pilihan warna yang menawan.',
    price: 269150,
    images: ['/products/rosca-2.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 110,
  },
  {
    id: '3',
    name: 'Rosca JoraJug',
    slug: 'rosca-jorajug',
    description: 'Tumbler stainless 1 Liter dengan double wall vacuum insulation technology. Menjaga suhu panas hingga 10 jam dan dingin hingga 20 jam. Desain modern dan stylish cocok untuk penggunaan sehari-hari di kantor, gym, atau aktivitas outdoor.',
    price: 178484,
    images: ['/products/rosca-3.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 270,
  },
  {
    id: '4',
    name: 'Rosca JoraJug Cosmic',
    slug: 'rosca-jorajug-cosmic',
    description: 'Edisi spesial Cosmic dengan desain gradient yang unik dan eye-catching. Tumbler stainless 1 Liter dengan double wall insulation. Setiap tumbler memiliki pola gradient yang berbeda, menjadikannya eksklusif dan Limited Edition.',
    price: 183484,
    images: ['/products/rosca-4.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 120,
  },
  {
    id: '5',
    name: 'Rosca HandyJug',
    slug: 'rosca-handyjug',
    description: 'Tumbler stainless 1 Liter dengan fitur unik strap/handle yang handy. Mudah dibawa kemana saja tanpa takut jatuh. Double wall insulation menjaga suhu minuman. Ideal untuk aktivitas outdoor, hiking, atau sekadar jalan-jalan.',
    price: 211399,
    images: ['/products/rosca-5.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 180,
  },
  {
    id: '6',
    name: 'Rosca JoraJug',
    slug: 'rosca-jorajug-variant',
    description: 'Tumbler stainless 1 Liter dengan double wall vacuum insulation technology. Menjaga suhu panas hingga 10 jam dan dingin hingga 20 jam. Desain modern dan stylish cocok untuk penggunaan sehari-hari di kantor, gym, atau aktivitas outdoor.',
    price: 190736,
    images: ['/products/rosca-6.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 300,
  },
  {
    id: '7',
    name: 'Rosca Engraved HandyJug',
    slug: 'rosca-engraved-handyjug',
    description: 'Tumbler stainless premium dengan layanan custom engraving. Bisa request nama, inisial, atau desain sesuai keinginan. Perfect untuk hadiah ulang tahun, anniversary, atau corporate gift. Kualitas engraving yang rapi dan tahan lama.',
    price: 199975,
    images: ['/products/rosca-7.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 190,
  },
  {
    id: '8',
    name: 'Rosca HandyJug',
    slug: 'rosca-handyjug-variant',
    description: 'Tumbler stainless 1 Liter dengan fitur unik strap/handle yang handy. Mudah dibawa kemana saja tanpa takut jatuh. Double wall insulation menjaga suhu minuman. Ideal untuk aktivitas outdoor, hiking, atau sekadar jalan-jalan.',
    price: 186631,
    images: ['/products/rosca-8.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 310,
  },
  {
    id: '9',
    name: 'Rosca PoppyJug',
    slug: 'rosca-poppyjug-variant',
    description: 'Tumbler stainless 1 Liter dengan desain slim dan elegant. Double wall insulation menjaga suhu minuman tetap panas atau dingin hingga 8 jam. Bentuknya yang ramping mudah masuk ke tas dan cup holder mobil. Available dalam berbagai pilihan warna yang menawan.',
    price: 259613,
    images: ['/products/rosca-9.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 320,
  },
  {
    id: '10',
    name: 'Rosca Engraved OzzyJug',
    slug: 'rosca-engraved-ozzyjug',
    description: 'Tumbler stainless premium dengan layanan custom engraving. Bisa request nama, inisial, atau desain sesuai keinginan. Perfect untuk hadiah ulang tahun, anniversary, atau corporate gift. Kualitas engraving yang rapi dan tahan lama.',
    price: 279000,
    images: ['/products/rosca-10.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 240,
  },
  {
    id: '11',
    name: 'Rosca HandyJug',
    slug: 'rosca-handyjug-slate',
    description: 'Tumbler stainless 1 Liter dengan fitur unik strap/handle yang handy. Mudah dibawa kemana saja tanpa takut jatuh. Double wall insulation menjaga suhu minuman. Ideal untuk aktivitas outdoor, hiking, atau sekadar jalan-jalan.',
    price: 186631,
    images: ['/products/rosca-11.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 330,
  },
  {
    id: '12',
    name: 'Rosca PoppyJug',
    slug: 'rosca-poppyjug-sage',
    description: 'Tumbler stainless 1 Liter dengan desain slim dan elegant. Double wall insulation menjaga suhu minuman tetap panas atau dingin hingga 8 jam. Bentuknya yang ramping mudah masuk ke tas dan cup holder mobil. Available dalam berbagai pilihan warna yang menawan.',
    price: 245000,
    images: ['/products/rosca-12.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 340,
  },
  {
    id: '13',
    name: 'Rosca PoppyJug',
    slug: 'rosca-poppyjug-sand',
    description: 'Tumbler stainless 1 Liter dengan desain slim dan elegant. Double wall insulation menjaga suhu minuman tetap panas atau dingin hingga 8 jam. Bentuknya yang ramping mudah masuk ke tas dan cup holder mobil. Available dalam berbagai pilihan warna yang menawan.',
    price: 259613,
    images: ['/products/rosca-13.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 350,
  },
  {
    id: '14',
    name: 'Rosca JoraJug',
    slug: 'rosca-jorajug-classic',
    description: 'Tumbler stainless 1 Liter dengan double wall vacuum insulation technology. Menjaga suhu panas hingga 10 jam dan dingin hingga 20 jam. Desain modern dan stylish cocok untuk penggunaan sehari-hari di kantor, gym, atau aktivitas outdoor.',
    price: 196034,
    images: ['/products/rosca-14.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 280,
  },
  {
    id: '15',
    name: 'Rosca JoraJug Cosmic',
    slug: 'rosca-jorajug-cosmic-variant',
    description: 'Edisi spesial Cosmic dengan desain gradient yang unik dan eye-catching. Tumbler stainless 1 Liter dengan double wall insulation. Setiap tumbler memiliki pola gradient yang berbeda, menjadikannya eksklusif dan Limited Edition.',
    price: 200273,
    images: ['/products/rosca-15.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 130,
  },
  {
    id: '16',
    name: 'Rosca Engraved PoppyJug',
    slug: 'rosca-engraved-poppyjug',
    description: 'Tumbler stainless premium dengan layanan custom engraving. Bisa request nama, inisial, atau desain sesuai keinginan. Perfect untuk hadiah ulang tahun, anniversary, atau corporate gift. Kualitas engraving yang rapi dan tahan lama.',
    price: 264613,
    images: ['/products/rosca-16.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 250,
  },
  {
    id: '17',
    name: 'Rosca JoraJug Prime',
    slug: 'rosca-jorajug-prime',
    description: 'Varian premium dari JoraJug dengan kualitas terbaik. Double wall vacuum insulation 1 Liter, copper plated untuk performa thermal maksimal. Desain elegant dengan finishing premium. Perfect gift untuk orang tersayang.',
    price: 229000,
    images: ['/products/rosca-17.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 140,
  },
  {
    id: '18',
    name: 'Rosca OzzyJug',
    slug: 'rosca-ozzyjug-variant',
    description: 'Tumbler stainless steel premium 770ml-1200ml dengan double wall vacuum insulation. Tahan panas hingga 12 jam dan dingin hingga 24 jam. Desain ergonomis yang nyaman digenggam, cocok untuk aktivitas sehari-hari, kerja, maupun traveling. Bahan food grade stainless steel 18/8 yang aman dan bebas BPA.',
    price: 289000,
    images: ['/products/rosca-18.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 360,
  },
  {
    id: '19',
    name: 'Rosca JumboJug',
    slug: 'rosca-jumbojug',
    description: 'Tumbler stainless jumbo 1.5 Liter dengan kapasitas extra besar. Double wall vacuum insulation untuk menjaga suhu hingga 12 jam. Cocok untuk yang membutuhkan hidrasi maksimal sepanjang hari. Dilengkapi dengan tali carry strap yang praktis.',
    price: 274448,
    images: ['/products/rosca-19.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 220,
  },
  {
    id: '20',
    name: 'Rosca HandyJug',
    slug: 'rosca-handyjug-rose',
    description: 'Tumbler stainless 1 Liter dengan fitur unik strap/handle yang handy. Mudah dibawa kemana saja tanpa takut jatuh. Double wall insulation menjaga suhu minuman. Ideal untuk aktivitas outdoor, hiking, atau sekadar jalan-jalan.',
    price: 194975,
    images: ['/products/rosca-20.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 370,
  },
  {
    id: '21',
    name: 'Rosca OzzyJug',
    slug: 'rosca-ozzyjug-mint',
    description: 'Tumbler stainless steel premium 770ml-1200ml dengan double wall vacuum insulation. Tahan panas hingga 12 jam dan dingin hingga 24 jam. Desain ergonomis yang nyaman digenggam, cocok untuk aktivitas sehari-hari, kerja, maupun traveling. Bahan food grade stainless steel 18/8 yang aman dan bebas BPA.',
    price: 274000,
    images: ['/products/rosca-21.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 380,
  },
  {
    id: '22',
    name: 'Rosca PoppyJug',
    slug: 'rosca-poppyjug-mauve',
    description: 'Tumbler stainless 1 Liter dengan desain slim dan elegant. Double wall insulation menjaga suhu minuman tetap panas atau dingin hingga 8 jam. Bentuknya yang ramping mudah masuk ke tas dan cup holder mobil. Available dalam berbagai pilihan warna yang menawan.',
    price: 274448,
    images: ['/products/rosca-22.webp'],
    category: 'Tumbler',
    badge: 'SALE',
    stock: 50,
    sold: 390,
  },
  {
    id: '23',
    name: 'Rosca JoraJug Prime',
    slug: 'rosca-jorajug-prime-variant',
    description: 'Varian premium dari JoraJug dengan kualitas terbaik. Double wall vacuum insulation 1 Liter, copper plated untuk performa thermal maksimal. Desain elegant dengan finishing premium. Perfect gift untuk orang tersayang.',
    price: 239000,
    images: ['/products/rosca-23.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 230,
  },
  {
    id: '24',
    name: 'Rosca Engraved JumboJug',
    slug: 'rosca-engraved-jumbojug',
    description: 'Tumbler stainless premium dengan layanan custom engraving. Bisa request nama, inisial, atau desain sesuai keinginan. Perfect untuk hadiah ulang tahun, anniversary, atau corporate gift. Kualitas engraving yang rapi dan tahan lama.',
    price: 311237,
    images: ['/products/rosca-24.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 260,
  },
  {
    id: '25',
    name: 'Rosca x The Bath Box Bundle',
    slug: 'rosca-bath-box-bundle',
    description: 'Special bundle Rosca x The Bath Box. Buy 2 Get 1 produk The Bath Box gratis. Paket lengkap hidrasi dan skincare. Limited stock untuk penawaran spesial ini. Perfect combo untuk self-care routine.',
    price: 412202,
    images: ['/products/rosca-25.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 200,
  },
  {
    id: '26',
    name: 'Rosca JoraJug',
    slug: 'rosca-jorajug-cream',
    description: 'Tumbler stainless 1 Liter dengan double wall vacuum insulation technology. Menjaga suhu panas hingga 10 jam dan dingin hingga 20 jam. Desain modern dan stylish cocok untuk penggunaan sehari-hari di kantor, gym, atau aktivitas outdoor.',
    price: 205571,
    images: ['/products/rosca-26.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 290,
  },
  {
    id: '27',
    name: 'Rosca Engraved MiciCup',
    slug: 'rosca-engraved-micicup',
    description: 'Tumbler kopi compact 480ml yang perfect untuk coffee lovers. Desain slim yang pas di genggaman dan mudah dibawa. Double wall menjaga suhu kopi tetap panas. Cocok untuk penggemar kopi yang ingin menikmati brew favorit di mana saja.',
    price: 205273,
    images: ['/products/rosca-27.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 150,
  },
  {
    id: '28',
    name: 'Rosca JumboJug x The Bath Box',
    slug: 'rosca-jumbojug-bundle',
    description: 'Special bundle Rosca x The Bath Box. Buy 2 Get 1 produk The Bath Box gratis. Paket lengkap hidrasi dan skincare. Limited stock untuk penawaran spesial ini. Perfect combo untuk self-care routine.',
    price: 491675,
    images: ['/products/rosca-28.webp'],
    category: 'Tumbler',
    badge: 'BEST',
    stock: 50,
    sold: 210,
  },
  {
    id: '29',
    name: 'Rosca MiciCup',
    slug: 'rosca-micicup',
    description: 'Tumbler kopi compact 480ml yang perfect untuk coffee lovers. Desain slim yang pas di genggaman dan mudah dibawa. Double wall menjaga suhu kopi tetap panas. Cocok untuk penggemar kopi yang ingin menikmati brew favorit di mana saja.',
    price: 200273,
    images: ['/products/rosca-29.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 160,
  },
  {
    id: '30',
    name: 'Rosca MiciCup',
    slug: 'rosca-micicup-variant',
    description: 'Tumbler kopi compact 480ml yang perfect untuk coffee lovers. Desain slim yang pas di genggaman dan mudah dibawa. Double wall menjaga suhu kopi tetap panas. Cocok untuk penggemar kopi yang ingin menikmati brew favorit di mana saja.',
    price: 200273,
    images: ['/products/rosca-30.webp'],
    category: 'Tumbler',
    badge: 'NEW',
    stock: 50,
    sold: 170,
  },
];

// Rosca Sliders - Using Shopee Product Images
export const sliders: Slider[] = [
  {
    id: '1',
    image: '/products/rosca-1.webp',
    title: 'NEW ARRIVAL',
    subtitle: 'Rosca OzzyJug Collection - Tahan Panas/Dingin Hingga 12 Jam',
    ctaText: 'SHOP NOW',
    ctaLink: '/catalog',
  },
  {
    id: '2',
    image: '/products/rosca-4.webp',
    title: 'COSMIC EDITION',
    subtitle: 'Edisi Spesial dengan Desain Gradient yang Unik',
    ctaText: 'EXPLORE',
    ctaLink: '/catalog',
  },
  {
    id: '3',
    image: '/products/rosca-19.webp',
    title: 'JUMBOJUG 1.5L',
    subtitle: 'Kapasitas Besar untuk Hidrasi Seharian',
    ctaText: 'SHOP NOW',
    ctaLink: '/catalog',
  },
  {
    id: '4',
    image: '/products/rosca-25.webp',
    title: 'SPECIAL BUNDLE',
    subtitle: 'Rosca x The Bath Box - Buy 2 Get 1',
    ctaText: 'GET DEAL',
    ctaLink: '/catalog',
  },
];

// Dummy Reviews
export const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely love the Sunshine Perfume! The scent lasts all day and I always get compliments.',
    date: '2024-01-10',
    productId: '1',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'John D.',
    rating: 5,
    comment: 'The Velvet Cream is amazing. My skin has never felt so soft and hydrated.',
    date: '2024-01-08',
    productId: '2',
    status: 'Approved',
  },
  {
    id: '3',
    name: 'Lisa K.',
    rating: 4,
    comment: 'Great quality products and fast shipping. Will definitely order again!',
    date: '2024-01-05',
    productId: '4',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Mike R.',
    rating: 5,
    comment: 'Best night cream I have ever used! My skin looks so much brighter.',
    date: '2024-01-03',
    productId: '8',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'Emma W.',
    rating: 5,
    comment: 'The Midnight Essence is perfect for evening events. So elegant!',
    date: '2024-01-02',
    productId: '3',
    status: 'Approved',
  },
  {
    id: '6',
    name: 'David L.',
    rating: 4,
    comment: 'Good product, but a bit expensive. Worth it for the quality though.',
    date: '2023-12-28',
    productId: '4',
    status: 'Pending',
  },
];

// Dummy Users
export const users: User[] = [
  {
    id: '1',
    name: 'Sarah M.',
    email: 'sarah.m@email.com',
    phone: '+62 812 3456 7890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    orders: 12,
    totalSpent: 5400000,
    joinedDate: 'Jan 2023',
  },
  {
    id: '2',
    name: 'John D.',
    email: 'john.doe@email.com',
    phone: '+62 813 4567 8901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    orders: 8,
    totalSpent: 3200000,
    joinedDate: 'Feb 2023',
  },
  {
    id: '3',
    name: 'Lisa K.',
    email: 'lisa.k@email.com',
    phone: '+62 814 5678 9012',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    orders: 6,
    totalSpent: 2100000,
    joinedDate: 'Mar 2023',
  },
  {
    id: '4',
    name: 'Mike R.',
    email: 'mike.r@email.com',
    phone: '+62 815 6789 0123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    orders: 5,
    totalSpent: 1850000,
    joinedDate: 'Apr 2023',
  },
  {
    id: '5',
    name: 'Emma W.',
    email: 'emma.w@email.com',
    phone: '+62 816 7890 1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    orders: 4,
    totalSpent: 1600000,
    joinedDate: 'May 2023',
  },
];

// Dummy Affiliates
export const affiliates: Affiliate[] = [
  {
    id: 'AFF001',
    name: 'Sarah M.',
    email: 'sarah.m@email.com',
    sales: 45,
    commission: 2250000,
    status: 'Active',
    joinDate: 'Jan 2023',
  },
  {
    id: 'AFF002',
    name: 'John D.',
    email: 'john.doe@email.com',
    sales: 32,
    commission: 1600000,
    status: 'Active',
    joinDate: 'Feb 2023',
  },
  {
    id: 'AFF003',
    name: 'Lisa K.',
    email: 'lisa.k@email.com',
    sales: 28,
    commission: 1400000,
    status: 'Active',
    joinDate: 'Mar 2023',
  },
  {
    id: 'AFF004',
    name: 'Mike R.',
    email: 'mike.r@email.com',
    sales: 21,
    commission: 1050000,
    status: 'Pending',
    joinDate: 'Apr 2023',
  },
];

// Dummy Orders
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Sarah M.',
    email: 'sarah.m@email.com',
    items: [
      { productId: '1', name: 'Sunshine Perfume', quantity: 1, price: 450000 },
      { productId: '2', name: 'Velvet Cream', quantity: 2, price: 350000 },
    ],
    total: 1150000,
    status: 'Pending',
    date: '15 Jan 2024',
    shippingMethod: 'Regular',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'ORD-002',
    customer: 'John D.',
    email: 'john.doe@email.com',
    items: [
      { productId: '2', name: 'Velvet Cream', quantity: 1, price: 350000 },
    ],
    total: 350000,
    status: 'Paid',
    date: '14 Jan 2024',
    shippingMethod: 'Express',
    paymentMethod: 'GoPay',
  },
  {
    id: 'ORD-003',
    customer: 'Lisa K.',
    email: 'lisa.k@email.com',
    items: [
      { productId: '4', name: 'Glow Serum', quantity: 1, price: 280000 },
    ],
    total: 280000,
    status: 'Shipped',
    date: '13 Jan 2024',
    shippingMethod: 'Regular',
    paymentMethod: 'OVO',
  },
  {
    id: 'ORD-004',
    customer: 'Mike R.',
    email: 'mike.r@email.com',
    items: [
      { productId: '3', name: 'Midnight Essence', quantity: 1, price: 520000 },
      { productId: '8', name: 'Night Repair', quantity: 1, price: 420000 },
    ],
    total: 940000,
    status: 'Delivered',
    date: '12 Jan 2024',
    shippingMethod: 'Express',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-005',
    customer: 'Emma W.',
    email: 'emma.w@email.com',
    items: [
      { productId: '1', name: 'Sunshine Perfume', quantity: 1, price: 450000 },
    ],
    total: 450000,
    status: 'Paid',
    date: '11 Jan 2024',
    shippingMethod: 'Regular',
    paymentMethod: 'Dana',
  },
];

// Dummy Shipping Methods
export const shippingMethods: ShippingMethod[] = [
  {
    id: '1',
    name: 'Regular Shipping',
    price: 20000,
    days: '3-5 business days',
    active: true,
  },
  {
    id: '2',
    name: 'Express Shipping',
    price: 40000,
    days: '1-2 business days',
    active: true,
  },
  {
    id: '3',
    name: 'Same Day Delivery',
    price: 75000,
    days: 'Same day (Jakarta only)',
    active: false,
  },
];

// Dummy Payment Methods
export const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Bank Transfer', icon: '🏦', active: true },
  { id: '2', name: 'GoPay', icon: '💙', active: true },
  { id: '3', name: 'OVO', icon: '💜', active: true },
  { id: '4', name: 'Dana', icon: '💚', active: true },
  { id: '5', name: 'Credit Card', icon: '💳', active: false },
];

// Export all data
export const dummyData = {
  products,
  sliders,
  reviews,
  users,
  affiliates,
  orders,
  shippingMethods,
  paymentMethods,
};

// Helper functions
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getNewProducts = (): Product[] => {
  return products.filter(p => p.badge === 'NEW');
};

export const getBestProducts = (): Product[] => {
  return products.filter(p => p.badge === 'BEST').length > 0
    ? products.filter(p => p.badge === 'BEST')
    : [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
};

export const getSaleProducts = (): Product[] => {
  return products.filter(p => p.badge === 'SALE' || p.originalPrice);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
