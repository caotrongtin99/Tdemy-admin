import { Login } from "./components";
import { loggedIn } from "./App.atom";
import {
  Home,
  AuthHome,
  StudentAddEdit,
  CourseAddEdit,
} from "./components";

import { Switch, Redirect, Route } from "react-router-dom";
import { useAtomValue } from "jotai/utils";
import { withValid as withValidRouter } from "./utils";
import StudentList from "./components/StudentList/StudentList";
import CourseList from "./components/CourseList/CourseList";
import { CategoryAdd } from "./components/CategoryAdd/CategoryAdd";

export const AppSwitch = () => {
  const isLoggedIn = useAtomValue(loggedIn);

  const renderIfLoggedIn = () => isLoggedIn;

  const renderIfNotLoggedIn = () => !isLoggedIn;

  return (
    <Switch>
      <Route
        exact
        path="/user/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: StudentList,
        })}
      />
      <Route
        exact
        path="/teacher/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: StudentAddEdit,
        })}
      />
      <Route
        exact
        path="/student/edit/:id"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: StudentAddEdit,
        })}
      />
      <Route
        exact
        path="/course/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseList,
        })}
      />
      <Route
        exact
        path="/course/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseAddEdit,
        })}
      />
      <Route
        exact
        path="/category/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseList,
        })}
      />
      <Route
        exact
        path="/category/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CategoryAdd,
        })}
      />
      <Route
        exact
        path="/course/edit/:id"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseAddEdit,
        })}
      />
      <Route
        exact
        path="/login"
        component={withValidRouter({
          isValid: renderIfNotLoggedIn,
          renderIfValid: Login,
        })}
      />
      <Route
        exact
        path="/"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: AuthHome,
          renderIfNotValid: Home,
        })}
      />
      <Redirect to="/login" />
    </Switch>
  );
};
