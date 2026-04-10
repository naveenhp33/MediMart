import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const JWT_SECRET = process.env.JWT_SECRET || "medfix_secret_key";

/* ================= DATABASE ================= */

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://nicky2603:naveen2603@cluster03.atbl7to.mongodb.net/MedFix";

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedUsers();
    await seedProducts();
  })
  .catch((err) => console.log(err));

/* ================= MODELS ================= */

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  addresses: [{
    fullName: String, phone: String, addressLine: String, city: String, state: String, pincode: String, isPrimary: { type: Boolean, default: false }
  }],
  cart: { type: Array, default: [] },
  wishlist: { type: Array, default: [] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  name: String, category: String, price: Number, description: String, imageUrl: String, stock: Number,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: false },
  requiresPrescription: { type: Boolean, default: false },
  expiryDate: String, shortDesc: String,
  reviews: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, userName: String, rating: Number, comment: String, createdAt: { type: Date, default: Date.now } }],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String, phone: String, address: String, paymentMethod: String, prescriptionUrl: String, items: Array, total: Number,
  status: { type: String, default: 'pending' },
  deliveryDate: String
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String, message: String, type: { type: String, enum: ['offer', 'reminder', 'system'], default: 'offer' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);

/* ================= SEED DATA ================= */

const seedUsers = async () => {
  try {
    const hashedAdmin = await bcrypt.hash("2605", 10);
    await User.findOneAndUpdate({ email: "medadmin@gmail.com" }, { name: "MediAdmin", password: hashedAdmin, role: "admin", status: "approved" }, { upsert: true });
    const hashedSeller = await bcrypt.hash("2604", 10);
    await User.findOneAndUpdate({ email: "naveen26@gmail.com" }, { name: "Naveen Seller", password: hashedSeller, role: "seller", status: "approved" }, { upsert: true });
  } catch (err) { console.error("User seed error", err); }
};

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));
      const seller = await User.findOne({ email: "naveen26@gmail.com" });
      const admin = await User.findOne({ role: 'admin' });
      const seededData = data.map(p => ({ ...p, isApproved: true, sellerId: seller ? seller._id : (admin ? admin._id : null) }));
      await Product.insertMany(seededData);
    }
  } catch (err) { console.error("Product seed error", err); }
};

/* ================= MIDDLEWARE ================= */

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("No token");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch { res.status(400).json("Invalid token"); }
};

/* ================= AUTH APIs ================= */

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("User exists");
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role: role || "customer", status: role === "seller" ? "pending" : "approved" });
  await user.save();
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
  res.json({ token, user });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json("User not found");
    if (user.role === "seller" && user.status !== "approved") return res.status(403).json(`Seller status: ${user.status}`);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Wrong password");
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) { res.status(500).json(err.message); }
});

/* ================= USER APIs ================= */

app.get("/api/user/address", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses || []);
});

app.post("/api/user/address", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push({ ...req.body, isPrimary: user.addresses.length === 0 });
  await user.save();
  res.json(user.addresses);
});

app.put("/api/user/address/:index", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses[req.params.index] = { ...user.addresses[req.params.index], ...req.body };
  await user.save();
  res.json(user.addresses);
});

app.delete("/api/user/address/:index", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.splice(req.params.index, 1);
  await user.save();
  res.json(user.addresses);
});

app.get("/api/user/cart", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.cart || []);
});

app.put("/api/user/cart", verifyToken, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { cart: req.body.cart }, { returnDocument: 'after' });
  res.json(user.cart);
});

app.get("/api/user/wishlist", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.wishlist || []);
});

app.put("/api/user/wishlist", verifyToken, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { wishlist: req.body.wishlist }, { returnDocument: 'after' });
  res.json(user.wishlist);
});

app.post("/api/user/complaint", verifyToken, async (req, res) => {
  const { sellerId, message } = req.body;
  await new Notification({ userId: sellerId, title: "⚠️ New Customer Feedback", message: `Concern: "${message}"`, type: 'reminder' }).save();
  res.json("Complaint registered");
});

/* ================= PRODUCT APIs ================= */

app.get("/api/products", async (req, res) => {
  const { category, search } = req.query;
  let filter = { isApproved: true };
  if (category && category !== "All") filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };
  const products = await Product.find(filter).populate('sellerId', 'name email');
  res.json(products);
});

app.get("/api/categories", async (req, res) => {
  const categories = await Product.distinct("category", { isApproved: true });
  res.json(["All", ...categories]);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate('sellerId', 'name email');
  res.json(product);
});

app.post("/api/products", verifyToken, async (req, res) => {
  const product = new Product({ ...req.body, sellerId: req.user.id, isApproved: false });
  await product.save();
  res.json(product);
});

app.post("/api/products/:id/review", verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  product.reviews.push({ userId: req.user.id, userName: req.user.name || "Customer", rating: Number(rating), comment });
  const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.averageRating = total / product.reviews.length;
  await product.save();
  res.json(product);
});

app.put("/api/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, sellerId: req.user.id },
    req.body,
    { new: true }
  );
  if (!product) return res.status(404).json("Product not found or unauthorized");
  res.json(product);
});

app.delete("/api/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
  if (!product) return res.status(404).json("Product not found or unauthorized");
  res.json("Product deleted");
});


/* ================= SELLER APIs ================= */

// ================= SELLER APIs =================

app.get("/api/seller/products", verifyToken, async (req, res) => {
  const products = await Product.find({ sellerId: req.user.id });
  res.json(products);
});

// 🔥 FIXED HERE (ObjectId + elemMatch)
app.get("/api/seller/orders", verifyToken, async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.find({
      items: {
        $elemMatch: { sellerId: sellerId }
      }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 🔥 FIXED HERE ALSO (same issue)
app.get("/api/seller/orders/:id", verifyToken, async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔥 Filter only seller's items
    const sellerItems = order.items.filter(
      (item) =>
        item.sellerId &&
        item.sellerId.toString() === sellerId.toString()
    );

    if (sellerItems.length === 0) {
      return res.status(404).json({
        error: "This order does not belong to this seller"
      });
    }

    res.json({
      ...order.toObject(),
      items: sellerItems // 👈 only seller items
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 🔥 FIXED HERE (ObjectId comparison bug)
app.get("/api/seller/stats", verifyToken, async (req, res) => {
  const productCount = await Product.countDocuments({ sellerId: req.user.id });

  const sellerId = new mongoose.Types.ObjectId(req.user.id);

  const orders = await Order.find({
    items: {
      $elemMatch: { sellerId: sellerId }
    }
  });

  let revenue = 0;

  orders.forEach(o =>
    o.items.forEach(i => {
      if (i.sellerId && i.sellerId.toString() === req.user.id) {
        revenue += i.price * i.qty;
      }
    })
  );

  res.json({
    productCount,
    orderCount: orders.length,
    revenue
  });
});

/* ================= ADMIN APIs ================= */

app.get("/api/admin/products/pending", verifyToken, async (req, res) => {
  res.json(await Product.find({ isApproved: false }).populate('sellerId', 'name email'));
});

app.put("/api/admin/products/:id/approve", verifyToken, async (req, res) => {
  res.json(await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { returnDocument: 'after' }));
});

app.get("/api/admin/users", verifyToken, async (req, res) => {
  res.json(await User.find({}));
});

app.put("/api/admin/sellers/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
  await new Notification({ userId: user._id, title: status === "approved" ? "✅ Approved!" : "❌ Update", message: status === "approved" ? "Your seller account is ready!" : "Application update.", type: 'system' }).save();
  res.json(user);
});

app.get("/api/admin/orders", verifyToken, async (req, res) => {
  res.json(await Order.find({}).sort({ createdAt: -1 }));
});

app.get("/api/admin/stats", verifyToken, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments({ isApproved: true });
  const pendingSellers = await User.countDocuments({ role: 'seller', status: 'pending' });
  const pendingProducts = await Product.countDocuments({ isApproved: false });
  const totalOrders = await Order.countDocuments();
  res.json({ totalUsers, totalProducts, pendingSellers, pendingProducts, totalOrders });
});

/* ================= ORDER APIs ================= */

app.get("/api/orders", verifyToken, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  
  // Dynamically populate seller names for the frontend if missing
  const augmentedOrders = await Promise.all(orders.map(async (o) => {
    const orderObj = o.toObject();
    orderObj.items = await Promise.all(orderObj.items.map(async (item) => {
      if (item.sellerName) return item;
      const product = await Product.findById(item.productId).populate('sellerId', 'name');
      return { ...item, sellerName: product?.sellerId?.name || "MediMart" };
    }));
    return orderObj;
  }));

  res.json(augmentedOrders);
});

app.post("/api/orders", verifyToken, async (req, res) => {
  const { items, ...orderData } = req.body;
  // Populate sellerId for each item from the Product model
  const populatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId).populate('sellerId', 'name');
      return { 
        ...item, 
        sellerId: product ? product.sellerId?._id : null,
        sellerName: product ? product.sellerId?.name : "MediMart"
      };
    })
  );
  const order = new Order({ ...orderData, userId: req.user.id, items: populatedItems });
  await order.save();

  // Create notification for customer
  const welcomeNote = new Notification({
    userId: req.user.id,
    title: "🎉 Order Placed!",
    message: "Woohoo! Your order is in! Our team is already running around (literally) to pack it for you! 🏃‍♂️💨",
    type: 'system'
  });
  await welcomeNote.save();

  res.json(order);
});

app.put("/api/orders/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;
  if (req.user.role === 'customer') return res.status(403).json("Only sellers/admins can update status");
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
  const titles = { processed: "⏳ Processed", shipped: "🚚 Shipped", delivered: "🎉 Delivered" };
  const msgs = { processed: "Packing your health! 🛁", shipped: "On its way! 🌍", delivered: "It's home! ✨" };
  await new Notification({ userId: order.userId, title: titles[status] || "📦 Update", message: msgs[status] || `Order is ${status}`, type: 'system' }).save();
  res.json(order);
});

/* ================= NOTIFICATION APIs ================= */

app.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    const saved = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    if (req.user.role === 'customer') {
      const buffer = new Date(); buffer.setDate(buffer.getDate() - 27);
      const orders = await Order.find({ userId: req.user.id, createdAt: { $gte: buffer } });
      const refillNotes = [];
      orders.forEach(o => {
        const diff = Math.floor((new Date() - o.createdAt) / (1000 * 60 * 60 * 24));
        if (diff >= 26 && diff <= 28) refillNotes.push({ _id: `refill-${o._id}`, title: "⏱️ Refill!", message: "Medicine's low! Time to restock. 💊", type: "reminder", isRead: false, createdAt: o.createdAt });
      });
      if (saved.length === 0 && refillNotes.length === 0) return res.json([{ _id: "welcome-msg", title: "👋 Welcome!", message: "We'll keep you updated here. 😊", type: "offer", isRead: true, createdAt: new Date() }]);
      return res.json([...refillNotes, ...saved]);
    }
    res.json(saved || []);
  } catch (err) { res.status(400).json("Error fetch"); }
});

app.put("/api/notifications/read-all", verifyToken, async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
  res.json("Marked all as read");
});

app.put("/api/notifications/:id/read", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined' || id.startsWith('refill-') || id === 'welcome-msg') return res.json("ok");
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json("Invalid ID");
  
  const note = await Notification.findByIdAndUpdate(id, { isRead: true }, { returnDocument: 'after' });
  res.json(note);
});

const upload = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => { if (!fs.existsSync("uploads")) fs.mkdirSync("uploads"); cb(null, "uploads/"); },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
}) });

app.post("/api/upload/prescription", upload.single("prescription"), (req, res) => {
  res.json({ url: `http://localhost:5001/uploads/${req.file.filename}` });
});

app.post("/api/upload/product", upload.single("image"), (req, res) => {
  res.json({ url: `http://localhost:5001/uploads/${req.file.filename}` });
});

/* ================= SERVER ================= */

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

app.get("/api/fix-orders-sellerid", async (req, res) => {
  const orders = await Order.find({});
  let updated = 0;
  for (const order of orders) {
    let changed = false;
    for (const item of order.items) {
      if (!item.sellerId && item.productId) {
        const product = await Product.findById(item.productId);
        if (product) {
          item.sellerId = product.sellerId;
          changed = true;
        }
      }
    }
    if (changed) {
      await order.save();
      updated++;
    }
  }
  res.json({ message: `Updated ${updated} orders` });
});