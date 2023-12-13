import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  Chip,
  Input,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import {
  platformSettingsData,
  conversationsData,
  projectsData,
  authorsTableData,
} from "@/data";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [listStaff, setListStaff] = useState([]);
  const [userState, setUserState] = useState({});
  const auth = getAuth();
  const userAuth = auth.currentUser;
  console.log("user", userAuth);
  const getUser = async () => {
    const docRef = doc(db, "users", userAuth.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserState(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const handleCreateStaff = () => {
    const emailLocal = localStorage.getItem("email");
    const passLocal = localStorage.getItem("password");

    if (userAuth) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const data = {
            email,
            name: "",
            parentId: userAuth.email,
            role: 2,
            createdAt: Timestamp.now(),
            status: 1,
          };
          if (user) {
            setDoc(doc(db, "users", email), data)
              .then(() => {
                signInWithEmailAndPassword(auth, emailLocal, passLocal);
                alert("dang ky thanh cong", user.email);
              })
              .catch((err) => {
                alert("dang ky that bai", err);
              });
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
          alert("dang ky that bai, ma loi: ", error.message);
        });
    } else {
      alert("user chinh khong ton tai");
    }
  };
  const getStaff = async () => {
    const q = query(
      collection(db, "users"),
      where("parentId", "==", userAuth.email),
    );

    const querySnapshot = await getDocs(q);
    const staffs = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      staffs.push(doc.data());
    });
    setListStaff(staffs);
  };
  useEffect(() => {
    getStaff();
    getUser();
  }, []);
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userState?.email}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {userState?.role == 1 ? "CEO" : `Nhân viên của ${userState.parentId}`}
                </Typography>
              </div>
            </div>
            <div className="w-96"></div>
          </div>
        </CardBody>
        {userState?.role == 1 && (
          <>
            <CardBody className="p-4">
              <div className="mb-1 flex flex-col gap-6">
                <div className="gird-cols-1 mb-2 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
                  <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Input
                    type="password"
                    size="lg"
                    placeholder="********"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button className="" onClick={handleCreateStaff}>
                    Create Staff
                  </Button>
                </div>
              </div>
            </CardBody>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Nhân viên", "Chức vụ", "Trạng thái", "Ngày tạo", ""].map(
                      (el) => (
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
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {listStaff.map(
                    (
                      { createdAt, name, email, role, status, parentId },
                      key,
                    ) => {
                      const className = `py-3 px-5 ${
                        key === listStaff.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={name}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {name}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {role == 2 ? "Nhân viên" : ""}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500"></Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={status == 1 ? "green" : "blue-gray"}
                              value={status == 1 ? "đang làm" : "nghỉ việc"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {new Date(createdAt.toDate()).toUTCString()}
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
          </>
        )}
      </Card>
    </>
  );
}

export default Profile;
