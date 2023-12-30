import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { getProductById } from "@/api/mockapi";

export function Products() {
  const [open, setOpen] = useState(false);
  const [openXuat, setOpenXuat] = useState(false);
  const [data, setData] = useState("No result");
  const [qr, setqr] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [mota, setMota] = useState("");
  const [masp, setMasp] = useState("");
  const [products, setProducts] = useState([]);
  const [listXuat, setListXuat] = useState([]);
  const listXuatRef = useRef([])
  const inputRef = useRef(null);
  const handleOpen = () => setOpen(!open);
  const handleOpenXuat = () => setOpenXuat(!openXuat);
  const handleQR = () => {
    setqr((pre) => !pre);
  };
  const handleAdd = async () => {
    const auth = getAuth();
    const userAuth = auth.currentUser;
    console.log("userauth", userAuth);
    // kiem tra sp da co chua
    const docRef = doc(db, "products", data);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      // neu co roi thi update
      const productRef = doc(db, "products", data);
      const newQuantity = Number(docSnap.data().quantity) + Number(quantity);
      await updateDoc(productRef, {
        quantity: Number(newQuantity),
        price: Number(price),
      });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      // neu chua co thi them moi
      const docData = {
        name,
        quantity: Number(quantity),
        price: Number(price),
        dateCreated: Timestamp.now(),
        mota,
        id: data,
        user_email: userAuth.email,
        status: true,
      };
      await setDoc(doc(db, "products", data), docData);
    }
    // tao phieu nhap

    const docPhieuNhap = {
      product_id: data,
      quantity: Number(quantity),
      status: true,
      dateCreated: Timestamp.now(),
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      staff_email: userAuth.email,
    };
    const docRefdocPhieuNhap = await addDoc(
      collection(db, "phieuNhaps"),
      docPhieuNhap,
    );
    console.log("Document written with ID: ", docRefdocPhieuNhap.id);
    setName("");
    setPrice(0);
    setMota("");
    setQuantity(0);
    setData("No result");
    alert("Thành công!");
  };
  const handleXuat = async () => {};
  const loadProducts = async () => {
    const auth = getAuth();
    const userAuth = auth.currentUser;
    let products = [];
    const q = query(
      collection(db, "products"),
      where("user_email", "==", userAuth.email),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      products.push(doc.data());
    });
    setProducts(products);
  };
  const handleListXuat = async (qr) => {
    if (!listXuatRef.current.includes(qr)) {
      console.log("listXuat", listXuatRef.current)
      // Nếu không tồn tại, thêm giá trị mới vào mảng
      // setListXuat(pre => [...pre, qr]);
      listXuatRef.current = [...listXuatRef.current, qr]
    }
  };
  useEffect(() => {
    if (data != "No result") {
      const item = getProductById(data);
      console.log("item", item);
      if (item != null) {
        console.log("setlaistate");
        setName(item.name);
        setPrice(item.price);
        setMota(item.moTa);
      }
    }
  }, [data]);
  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography
            variant="h6"
            color="white"
            className="flex flex-row justify-between"
          >
            <div>Products</div>
            <div>
              <Button onClick={handleOpen} variant="gradient">
                Thêm sản phẩm mới
              </Button>
              <Button onClick={handleOpenXuat} variant="gradient">
                Xuất hóa đơn bán hàng
              </Button>
              <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Thêm sản phẩm mới</DialogHeader>
                <DialogBody>
                  <div className="flex flex-row justify-between items-center">
                    <QrReader
                      className="h-40 w-40"
                      onResult={(result, error) => {
                        if (!!result) {
                          setData(result?.text);
                        }

                        if (!!error) {
                          console.log("error", error);
                        }
                      }}
                    />
                    <div className="w-1/2">
                      <Input
                        size="lg"
                        variant="Mã sản phẩm"
                        label="Mã sản phẩm"
                        value={data}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="h-5"></div>
                  <Input
                    size="lg"
                    variant="Tên sản phẩm"
                    label="Tên sản phẩm"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                  <div className="h-5"></div>
                  <Input
                    size="lg"
                    type="number"
                    min={1}
                    variant="Giá sản phẩm (đơn vị nghìn vnđ)"
                    label="Giá sản phẩm (đơn vị nghìn vnđ)"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    value={price}
                  />
                  <div className="h-5"></div>
                  <Input
                    size="lg"
                    type="number"
                    min={1}
                    max={100}
                    variant="Số lượng nhập"
                    label="Số lượng nhập"
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    value={quantity}
                    ref={inputRef}
                  />
                  <div className="h-5"></div>
                  <Textarea
                    placeholder="Mô tả"
                    onChange={(e) => {
                      setMota(e.target.value);
                    }}
                    value={mota}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button
                    variant="text"
                    color="red"
                    onClick={handleOpen}
                    className="mr-1"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button variant="gradient" color="green" onClick={handleAdd}>
                    <span>Thêm</span>
                  </Button>
                </DialogFooter>
              </Dialog>
            </div>
            <Dialog open={openXuat} size="xl" handler={handleOpenXuat}>
              <DialogHeader>Xuất hóa đơn bán hàng</DialogHeader>
              <DialogBody>
                <div className="flex flex-row justify-between items-center">
                  <QrReader
                    className="h-40 w-40"
                    onResult={(result, error) => {
                      if (!!result) {
                        console.log("result", result);
                        handleListXuat(result.text);
                      }

                      if (!!error) {
                        console.log("error", error);
                      }
                    }}
                    scanDelay={1000}
                  />
                  <div className="w-1/2">
                    <Input
                      size="lg"
                      variant="Mã sản phẩm"
                      label="Mã sản phẩm"
                      value={data}
                      readOnly
                    />
                  </div>
                </div>
                <table class="table-auto">
                  <thead>
                    <tr>
                      <th>Mã sản phẩm</th>
                      <th>Tên</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listXuatRef.current && listXuatRef.current.length > 0 && listXuatRef.current.map((item, index) => (
                      <tr key={index}>
                        <td>{item}</td>
                        <td>Malcolm Lockyer</td>
                        <td>1961</td>
                        <td>1961</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpenXuat}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleXuat}>
                  <span>Xuất</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "STT",
                  "Tên sản phẩm",
                  "Giá hiện tại",
                  "Trạng thái",
                  "Mã sản phẩm",
                  "Tồn kho",
                  "",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 &&
                products.map(
                  (
                    { id, dateCreated, name, price, quantity, status, mota },
                    key,
                  ) => {
                    const className = `py-3 px-5 ${
                      key === authorsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {key + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div className="w-[90%]">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500 overflow-hidden">
                                {mota}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {price}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={status ? "green" : "blue-gray"}
                            value={status ? "đang bán" : "dừng bán"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {id}
                          </Typography>
                        </td>
                        {/* <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                         {new Date(dateCreated.toDate()).toUTCString()}
                        </Typography>
                      </td> */}
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {quantity}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            Edit
                          </Typography>
                        </td>
                      </tr>
                    );
                  },
                )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Products;
