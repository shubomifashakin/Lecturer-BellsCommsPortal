import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";

import { CheckBox } from "../Components/CheckBox";
import { InputError, InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";

import {
  CheckRole,
  FindCourse,
  GetColleges,
  LogInUser,
  SignUpUser,
} from "../Actions/SupabaseActions";

import {
  emailEmpty,
  invalidPassword,
  passwordEmpty,
  passwordsNotMatch,
  SortArrayBasedOnLetters,
  valEmpty,
} from "../Actions/HelperActions";

const initialSignUpState = {
  selectedCourses: [],
  lectName: "",
  college: "",
  dept: "",
  email: "",
  password: "",
  valPassword: "",
};

const initialStep1State = {
  emailError: "",
  passwordError: "",
  valError: "",
};

const initialStep2State = {
  allColleges: [],
  allDepts: [],
  errorLectName: "",
  errorColl: "",
  errorDept: "",
  loadingColleges: false,
  errorFetching: false,
};

const initialStep3State = {
  searchParam: "",
  foundCourses: [],
  error: "",
  loading: false,
};

function SignUpReducer(state, { payload, label }) {
  switch (label) {
    case "setEmail":
      return { ...state, email: payload };

    case "setPassword":
      return { ...state, password: payload };

    case "setValPassword":
      return { ...state, valPassword: payload };

    case "setCollege":
      return { ...state, college: payload };

    case "setLectName":
      return { ...state, lectName: payload };

    case "setDept":
      return { ...state, dept: payload };

    case "addCourse":
      return { ...state, selectedCourses: [...state.selectedCourses, payload] };

    case "removeCourse":
      return {
        ...state,
        selectedCourses: state.selectedCourses.filter((c) => c !== payload),
      };
  }
}

function Step1Reducer(state, { payload, label }) {
  switch (label) {
    case "emailError":
      return { ...state, emailError: payload };

    case "passwordError":
      return { ...state, passwordError: payload };

    case "valError":
      return { ...state, valError: payload };

    case "allError":
      return {
        ...state,
        valError: valEmpty,
        passwordError: passwordEmpty,
        emailError: emailEmpty,
      };

    case "notMatch":
      return {
        ...state,
        valError: passwordsNotMatch,
        passwordError: passwordsNotMatch,
      };

    case "clearEmailError":
      return { ...state, emailError: "" };

    case "clearPasswordError":
      return { ...state, passwordError: "" };

    case "clearValError":
      return { ...state, valError: "" };
  }
}

function Step2Reducer(state, { label, payload }) {
  switch (label) {
    case "fetching":
      return { ...state, loadingColleges: true, errorFetching: false };

    case "errorFetching":
      return { ...state, errorFetching: true, loadingColleges: false };

    case "colleges":
      return { ...state, allColleges: payload, loadingColleges: false };

    case "depts":
      return { ...state, allDepts: payload };

    case "lectNameErr":
      return { ...state, errorLectName: payload };

    case "collErr":
      return { ...state, errorColl: payload };

    case "deptErr":
      return { ...state, errorDept: payload };

    case "allErr":
      return {
        ...state,
        errorLectName: "Please enter your name",
        errorColl: "Please select your college",
        errorDept: "Please select your department",
      };

    case "clearLectNameErr":
      return { ...state, errorLectName: "" };

    case "clearDeptErr":
      return { ...state, errorDept: "" };

    case "clearCollErr":
      return { ...state, errorColl: "" };

    case "clearAll":
      return { ...state, errorColl: "", errorDept: "", errorLectName: "" };
  }
}

function Step3Reducer(state, { payload, label }) {
  switch (label) {
    case "searching":
      return { ...state, searchParam: payload, loading: true };

    case "stopLoading":
      return { ...state, loading: false };

    case "error":
      return { ...state, loading: false, error: payload };

    case "foundCourses":
      return { ...state, loading: false, foundCourses: payload };

    case "clearSearchParam":
      return { ...state, searchParam: "" };
  }
}

function LoginPage() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const loggedInfo = JSON.parse(
    localStorage.getItem("sb-xqpgunhudqrnqtfkbiwg-auth-token"),
  );

  //545-signature
  //if there was no logged Info we assume the data has expired or the user has never logged in before

  //i added 3 zeros to it because supabase date.now() is wrong
  const hasExpired = loggedInfo
    ? Date.now() > Number(loggedInfo?.expires_at + "000")
    : true;

  //if the token in the storage had not expired when the user navigated to the log in page, redirect back to profile
  useEffect(
    function () {
      if (!hasExpired) {
        navigate("home");
      }
    },
    [hasExpired, navigate],
  );

  //if it has expired, return the sign in page, if not, return nothing cus we are redirecting

  return (
    <main className="bg-primaryBgColor flex h-dvh w-full items-center justify-center px-6">
      <div className="w-full space-y-3 md:w-3/4 lg:w-1/2 ">
        <span className="flex justify-center">
          <CheckBox checked={checked} setChecked={setChecked} />
        </span>

        {checked ? <SignUpForm setChecked={setChecked} /> : <LoginInForm />}

        <BottomLinks checked={checked} />
      </div>
    </main>
  );
}

function LoginInForm() {
  const navigate = useNavigate();
  const { formState, register, handleSubmit } = useForm();

  const [submitting, setSubmitting] = useState(false);
  const { errors } = formState;

  async function handleLogin(userData) {
    const { password, email } = userData;

    try {
      setSubmitting(true);

      //logs in the user
      await LogInUser(email, password);

      //gets the role of the user
      const [{ role }] = await CheckRole();

      //checks if the users role is student
      if (role !== "lecturer") {
        throw new Error("You are not a lecturer");
      }

      setSubmitting(false);

      navigate("home");
    } catch (err) {
      toast.error(err.message);
      localStorage.removeItem("sb-xqpgunhudqrnqtfkbiwg-auth-token");
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-flash space-y-2">
      <h2 className="text-2xl font-semibold">Log In</h2>
      <form className="block space-y-6" onSubmit={handleSubmit(handleLogin)}>
        <InputGroup label={"Email"}>
          {errors?.email?.message ? (
            <InputError errorMessage={errors?.email?.message} />
          ) : null}

          <input
            className="input-style"
            type="email"
            id="Email"
            name="email"
            placeholder="YourEmail@Email.com"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Password"}>
          {errors?.password?.message ? (
            <InputError errorMessage={errors?.password?.message} />
          ) : null}

          <input
            className="input-style"
            type="password"
            id="Password"
            placeholder="Your Password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
            })}
          />
        </InputGroup>

        <Button
          disabled={submitting}
          type={"full"}
          label={"Log In"}
          className="font-base  bg-bellsBlue hover:bg-hoverBellsBlue block w-full rounded-sm p-2 text-center text-base text-white duration-300"
        />
      </form>
    </div>
  );
}

const SignUpContext = createContext(null);

function SignUpForm({ setChecked }) {
  const [step, setStep] = useState(1);

  const [submitting, setSubmitting] = useState(false);

  const [
    { selectedCourses, lectName, college, dept, email, password, valPassword },
    dispatch,
  ] = useReducer(SignUpReducer, initialSignUpState);

  function decrStep() {
    if (step === 1) return;
    setStep((c) => c - 1);
  }

  function incrStep() {
    if (step === 3) return;
    setStep((c) => c + 1);
  }

  const signUpDetails = {
    email,
    password,
    courses: selectedCourses,
    lectName,
    college,
    dept,
  };

  //handles the signing up
  async function handleSignUp() {
    try {
      setSubmitting(true);
      await SignUpUser(signUpDetails);
      toast.success(`An email has been sent to ${email}`);

      //show log in ui
      setSubmitting(false);
      setChecked(false);
    } catch (error) {
      setSubmitting(false);
      toast.error(error.message);
    }
  }

  const ctxValues = {
    incrStep,
    email,
    password,
    valPassword,
    dispatch,
    lectName,
    college,
    dept,
    decrStep,
    selectedCourses,
    handleSignUp,
    submitting,
  };

  return (
    <SignUpContext.Provider value={ctxValues}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Sign Up</h2>

          <div className="flex space-x-2">
            <span
              className={`block h-3 w-3 rounded-full  ${step >= 1 ? " bg-hoverBellsBlue border border-stone-700 " : "bg-bellsBlue"}`}
            ></span>
            <span
              className={`block h-3 w-3 rounded-full  ${step >= 2 ? " bg-hoverBellsBlue border border-stone-700 " : "bg-bellsBlue"}`}
            ></span>
            <span
              className={`block h-3 w-3 rounded-full  ${step >= 3 ? " bg-hoverBellsBlue border border-stone-700 " : "bg-bellsBlue"}`}
            ></span>
          </div>
        </div>

        {step === 1 ? <Step1Form /> : null}

        {step === 2 ? <Step2Form /> : null}

        {step === 3 ? <Step3Form /> : null}
      </div>
    </SignUpContext.Provider>
  );
}

function Step1Form() {
  const { incrStep, email, password, valPassword, dispatch } =
    useContext(SignUpContext);

  const [{ emailError, passwordError, valError }, setErrors] = useReducer(
    Step1Reducer,
    initialStep1State,
  );

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const valRef = useRef(null);

  function handleEmail(value) {
    dispatch({ label: "setEmail", payload: value });

    setErrors({ label: "clearEmailError" });
  }

  function handlePassword(value) {
    dispatch({ label: "setPassword", payload: value });

    setErrors({ label: "clearPasswordError" });
  }

  function handleValPassword(value) {
    dispatch({ label: "setValPassword", payload: value });

    setErrors({ label: "clearValError" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!email && !password && !valPassword) {
      setErrors({ label: "allError" });
      emailRef.current.focus();
      return;
    }

    if (!email) {
      setErrors({ label: "emailError", payload: emailEmpty });
      emailRef.current.focus();
      return;
    }

    if (!password) {
      setErrors({ label: "passwordError", payload: passwordEmpty });
      passwordRef.current.focus();
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password)) {
      setErrors({ label: "passwordError", payload: invalidPassword });
      passwordRef.current.focus();
      return;
    }

    if (!valPassword) {
      setErrors({ label: "valError", payload: valEmpty });
      valRef.current.focus();
      return;
    }

    if (password !== valPassword) {
      setErrors({ label: "notMatch", payload: passwordsNotMatch });
      valRef.current.focus();
      return;
    }

    //go to next step
    incrStep();
  }

  return (
    <form
      className="animate-flash flex flex-col space-y-6 "
      onSubmit={handleSubmit}
    >
      <InputGroup label={"Email"}>
        {emailError ? <InputError errorMessage={emailError} /> : null}

        <input
          ref={emailRef}
          className="input-style"
          type="email"
          id="Email"
          placeholder="YourEmail@Email.com"
          value={email}
          onChange={(e) => handleEmail(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"Password"}>
        {passwordError ? <InputError errorMessage={passwordError} /> : null}

        <input
          ref={passwordRef}
          className="input-style"
          type="password"
          id="Password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => handlePassword(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"Re-type Password"}>
        {valError ? <InputError errorMessage={valError} /> : null}

        <input
          ref={valRef}
          className="input-style"
          type="password"
          id="validate"
          placeholder="Your Password Again"
          value={valPassword}
          onChange={(e) => handleValPassword(e.target.value)}
        />
      </InputGroup>

      <Button label={"Next"} />
    </form>
  );
}

function Step2Form() {
  const { decrStep, incrStep, lectName, college, dept, dispatch } =
    useContext(SignUpContext);

  const [
    {
      allColleges,
      allDepts,
      errorLectName,
      errorDept,
      errorColl,
      loadingColleges,
      errorFetching,
    },
    dispatch2,
  ] = useReducer(Step2Reducer, initialStep2State);

  const lectNameRef = useRef(null);
  const collegeRef = useRef(null);
  const deptRef = useRef(null);

  const sortedDepts = SortArrayBasedOnLetters(allDepts);

  function handleSubmit(e) {
    e.preventDefault();

    if (!lectName && !college && !dept) {
      dispatch2({ label: "allErr" });
      lectNameRef.current.focus();
      return;
    }

    if (!lectName) {
      dispatch2({
        label: "lectNameErr",
        payload: "Please enter your name",
      });
      lectNameRef.current.focus();
      return;
    }

    if (!college) {
      dispatch2({ label: "collErr", payload: "Please select your college" });
      collegeRef.current.focus();
      return;
    }

    if (!dept) {
      dispatch2({ label: "deptErr", payload: "Please select your department" });
      deptRef.current.focus();
      return;
    }

    //go to next step
    incrStep();
  }

  function handleLectName(value) {
    dispatch({ label: "setLectName", payload: value });

    dispatch2({ label: "clearLectNameErr" });
  }

  function handleCollege(value) {
    dispatch({ label: "setCollege", payload: value });

    dispatch2({ label: "clearCollErr" });
  }

  function handleDept(value) {
    dispatch({ label: "setDept", payload: value });

    dispatch2({ label: "clearDeptErr" });
  }

  async function getColleges() {
    try {
      dispatch2({ label: "fetching" });
      const colleges = await GetColleges();
      dispatch2({ label: "colleges", payload: colleges });
    } catch (err) {
      dispatch2({ label: "errorFetching" });
    }
  }

  //get list of colleges on mount
  useLayoutEffect(function () {
    getColleges();
  }, []);

  //get list of departments if a college has been selected, refetch anytime the college changes
  useEffect(
    function () {
      //if user has not selected a college, do not fetch yet
      if (!college || !allColleges.length) return;

      const deptsInCollege = allColleges.find((c) => {
        return c.college === college;
      }).departments;

      dispatch2({ label: "depts", payload: deptsInCollege });
    },
    [college, allColleges],
  );

  return (
    <form
      className="animate-flash flex flex-col space-y-6 "
      onSubmit={handleSubmit}
    >
      <InputGroup label={"Name"}>
        {errorLectName ? <InputError errorMessage={errorLectName} /> : null}

        <input
          ref={lectNameRef}
          className="input-style"
          type="text"
          id="name"
          placeholder="Your Name"
          value={lectName}
          onChange={(e) => handleLectName(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"College"}>
        {loadingColleges ? (
          <p className="text-xs text-green-500">Fetching Colleges</p>
        ) : null}

        {errorFetching ? (
          <p
            onClick={getColleges}
            className="cursor-pointer text-xs font-bold capitalize text-red-600 transition-colors duration-300 ease-in-out hover:text-red-800"
          >
            Failed to fetch colleges, click to retry
          </p>
        ) : null}

        {errorColl ? <InputError errorMessage={errorColl} /> : null}

        <select
          ref={collegeRef}
          className="input-style"
          value={college ? college : null}
          onChange={(e) => handleCollege(e.target.value)}
        >
          <option className="text-center" selected disabled>
            --- Please select your college ---
          </option>

          {allColleges.map((college, i) => {
            return (
              <option className="text-center" value={college.college} key={i}>
                {college.college}
              </option>
            );
          })}
        </select>
      </InputGroup>

      {/*show the selection input if the user has selected a college && all the departments for that college have been fetched */}
      {allDepts.length ? (
        <InputGroup label={"Department"}>
          {errorDept ? <InputError errorMessage={errorDept} /> : null}

          <select
            ref={deptRef}
            className="input-style"
            value={dept ? dept : null}
            onChange={(e) => handleDept(e.target.value)}
          >
            <option className="text-center" selected disabled>
              --- Please select a department ---
            </option>

            {sortedDepts.map((dept, i) => {
              return (
                <option className="text-center" key={i} value={dept}>
                  {dept}
                </option>
              );
            })}
          </select>
        </InputGroup>
      ) : null}

      <div className="flex justify-between">
        <Button action={decrStep} label={"Previous"} />
        <Button label={"Next"} />
      </div>
    </form>
  );
}

function Step3Form() {
  const { decrStep, selectedCourses, dispatch, handleSignUp, submitting } =
    useContext(SignUpContext);

  const [{ searchParam, loading, error, foundCourses }, dispatch2] = useReducer(
    Step3Reducer,
    initialStep3State,
  );

  const orderedSelectedCourses = SortArrayBasedOnLetters(selectedCourses);
  const searchRef = useRef(null);

  function addCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();
    if (selectedCourses.includes(course)) return;
    dispatch({ label: "addCourse", payload: course });
    dispatch2({ label: "clearSearchParam" });
    searchRef.current.focus();
  }

  function removeCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();
    dispatch({ label: "removeCourse", payload: course });
  }

  function handleSubmit(e) {
    e.preventDefault();

    //if no course was selected, do not submit
    if (!selectedCourses.length) {
      searchRef.current.focus();
      return;
    }

    handleSignUp();
  }

  //search for course on change
  useEffect(
    function () {
      const abortController = new AbortController();

      async function getCourses() {
        try {
          const data = await FindCourse(searchParam, abortController);

          dispatch2({ label: "foundCourses", payload: data });
        } catch (err) {
          if (abortController.signal.aborted) {
            dispatch2({ label: "stopLoading" });
            return;
          }
          dispatch2({ label: "error", payload: err.message });
        }
      }

      if (searchParam.length) {
        getCourses();
      }

      return () => abortController.abort();
    },
    [searchParam],
  );

  return (
    <form className="animate-flash space-y-2" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs">Select Courses You Are Offering</h2>
        <span className="text-xs capitalize">
          {orderedSelectedCourses.length} courses selected
        </span>
      </div>

      <input
        type="text"
        ref={searchRef}
        placeholder="Search for a course"
        className="input-style w-full "
        value={searchParam}
        onChange={(e) =>
          dispatch2({ label: "searching", payload: e.target.value })
        }
      />

      <div className="max-h-52 overflow-y-auto p-2 lg:max-h-40">
        {/**if we have finished searching */}
        {searchParam && !loading && !error ? (
          <>
            <h2 className="text-xs">Found Courses</h2>
            {foundCourses.length ? (
              foundCourses.map((course, i) => {
                return (
                  <div
                    className="flex items-center justify-between py-2"
                    key={i}
                  >
                    <span> {course.course_code}</span>

                    <div className="flex items-center">
                      <button
                        className="hover:text-hoverBellsBlue active:text-hoverBellsBlue text-sm transition-colors duration-300 ease-in-out"
                        onClick={(e) => addCourse(e, course.course_code)}
                      >
                        <IoIosAddCircle className=" hover:text-hoverBellsBlue text-xl text-black" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm">No course found</p>
            )}
          </>
        ) : null}

        {/** if we are still searching */}
        {loading && searchParam ? (
          <p className="text-center text-sm">Finding Course...</p>
        ) : null}

        {/**if the user is not searching for anything show the selected courses */}
        {!searchParam ? (
          <>
            <h2 className="text-xs">Selected Courses</h2>
            {orderedSelectedCourses.map((course, i) => {
              return (
                <div className="flex items-center justify-between py-2" key={i}>
                  <span> {course}</span>

                  <div className="flex items-center px-1">
                    <button
                      className="hover:text-hoverBellsBlue active:text-hoverBellsBlue text-sm transition-colors duration-300 ease-in-out"
                      onClick={(e) => removeCourse(e, course)}
                    >
                      <IoIosCloseCircle className=" hover:text-hoverBellsBlue text-xl text-black" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>

      <div className="flex justify-between">
        <Button action={decrStep} label={"Previous"} />

        <Button disabled={submitting} label={"Sign Up"} />
      </div>
    </form>
  );
}

function BottomLinks({ checked }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-center text-xs">
        Are you a Student? &nbsp;
        <a
          href="https://student-bellscommsportal.netlify.app/"
          className="hover:text-hoverBellsBlue underline transition-colors duration-300 ease-in-out"
        >
          Visit Here
        </a>
      </p>

      {!checked ? (
        <Link
          to={"/forgotPassword"}
          className="hover:text-hoverBellsBlue text-xs  underline transition-colors duration-300 ease-in-out"
        >
          Forgot Password?
        </Link>
      ) : null}
    </div>
  );
}

export default LoginPage;
