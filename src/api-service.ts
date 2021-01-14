import { default as axios } from "axios";
import { ListOpts } from "./index.types";

const origin: string =
  process.env.REACT_APP_API_ORIGIN || "${REACT_APP_API_URL}/api";
axios.defaults.baseURL = origin;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

const getUserName = (): string | null => sessionStorage.getItem("c1");
const getPassword = (): string | null => sessionStorage.getItem("c2");

const request = (
  url: string,
  method: string,
  config: any = {},
  auth = true
) => {
  if (auth) {
    config = {
      ...config,
      headers: {
        'x-access-token': localStorage.getItem('token'),
        "x-refresh-token": localStorage.getItem('ref_token')
      },
      auth: {
        username: getUserName() || "",
        password: getPassword() || "",
      },
    };
  }
  return axios({ ...config, url, method });
};

const getListOpts = (opts: ListOpts): string[][] => {
  const {
    filter: { key = "", value = "" } = {},
    pagination: { page = "", perPage = "" } = {},
    sort: { order = "", by = "" } = {},
  } = opts;

  return [
    ["filter_key", key],
    ["filter_value", value],
    ["page", page.toString()],
    ["per_page", perPage.toString()],
    ["sort_order", order],
    ["sort_by", by],
  ];
};

const crud = (key: string) => {
  const list = `/users`;
  const listOne = (id: string) => `${key}/${id}`;
  const createOne = `${key}/create`;
  const updateOne = listOne;
  const deleteOne = listOne;

  const f_createOne = (record: any) =>
    request(createOne, "POST", { data: record });
  const f_listOne = (id: string) => request(listOne(id), "GET");
  const f_list = (opts?: ListOpts) => {
    const params = new URLSearchParams(
      getListOpts(opts || {}).filter((val) => val[1])
    ).toString();
    debugger
    return request(`${list}${params ? `?${params}` : ""}`, "GET");
  };
  const f_updateOne = (id: string, record: any) =>
    request(updateOne(id), "PUT", { data: record });
  const f_deleteOne = (id: string) => request(deleteOne(id), "DELETE");

  return {
    CREATE: f_createOne,
    READ_ONE: f_listOne,
    DELETE: f_deleteOne,
    READ: f_list,
    UPDATE: f_updateOne,
  };
};

export const login = (email: string, password: string) => {
  return axios.post("/auth", { email, password });
};

export const me = () => {
  return request(`/me/${getUserName()}`, "get");
};

export const student = crud("/student");
export const course = crud("/course");
