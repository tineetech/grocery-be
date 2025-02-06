import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthRouter } from "./routers/auth.router";
import { CustomerRouter } from "./routers/customer.router";
import { SuperAdminRouter } from "./routers/super-admin.router";
import { StoreAdminRouter } from "./routers/store-admin.router";
import { ProductRouter } from "./routers/product.router";
import { InventoryRouter } from "./routers/inventory.router";
import { StoreRouter } from "./routers/store.router";
import { CategoryRouter } from "./routers/category.router";
import { ProductImageRouter } from "./routers/product-image.router";
import { RajaOngkirRouter } from "./routers/rajaongkir.router";

const PORT: number = 8000;
const base_url_fe = process.env.BASE_URL_FE;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: base_url_fe,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const authRouter = new AuthRouter();
const customerRouter = new CustomerRouter()
const superAdminRouter = new SuperAdminRouter()
const storeAdminRouter = new StoreAdminRouter()
const productRouter = new ProductRouter()
const inventoryRouter = new InventoryRouter()
const storeRouter = new StoreRouter()
const categoryRouter = new CategoryRouter()
const productImageRouter = new ProductImageRouter()
const rajaOngkirRouter = new RajaOngkirRouter();

app.use("/api/auth", authRouter.getRouter()); // sasa
app.use("/api/customer", customerRouter.getRouter()) // sasa
app.use("/api/super-admin", superAdminRouter.getRouter()) // zaki
app.use("/api/store-admin",storeAdminRouter.getRouter()) // zaki
app.use("/api/product",productRouter.getRouter()) // zaki
app.use("/api/inventory",inventoryRouter.getRouter()) // zaki
app.use("/api/store",storeRouter.getRouter()) // zaki
app.use("/api/category",categoryRouter.getRouter()) // zaki
app.use("/api/product-image",productImageRouter.getRouter()) // zaki
app.use("/api/rajaongkir", rajaOngkirRouter.getRouter()); //all


app.get("/api", (req, res) => {
  res.send("Welcome to the API!"); 
});

app.listen(PORT, () => {
  console.log(`Server is running on -> http://localhost:${PORT}/api`);
});

