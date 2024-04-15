import { supabase } from "../supabase";

export async function SignUpUser(details) {
  const { email, password, college, dept, lectName, courses } = details;

  let { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        courses,
        college,
        name: lectName,
        dept,
        role: "lecturer",
      },
    },
  });

  if (error?.message) throw error;
}

export async function LogInUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.message) throw error;

  return data;
}

export async function CheckRole() {
  let { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("role");

  if (error?.message) throw error;

  return user_roles;
}

export async function FindCourse(course, abortSignal) {
  let { data: Courses, error } = await supabase
    .from("Courses")
    .select("course_code")
    .ilike("course_code", `%${course}%`)
    .order("course_code", { ascending: true })
    .abortSignal(abortSignal.signal);

  if (error?.message) throw new Error(error.message);

  return Courses;
}

export async function GetColleges() {
  let { data: Colleges, error } = await supabase
    .from("Colleges")
    .select("*")
    .order("college", { ascending: true });

  if (error) throw error;

  return Colleges;
}

export async function ResetPassword(email) {
  let { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://lecturer-bellscommsportal.netlify.app/updatePassword",
  });

  if (error?.message) throw error;
}

export async function UpdatePassword(password) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error?.message) throw error;
}

export async function GetLecturersData() {
  let { data: Lecturer, error } = await supabase
    .from("Lecturers")
    .select("name,college,dept,courses,created_at");
  if (error?.message) throw error;

  return Lecturer;
}

export async function LogOutFn() {
  let { error } = await supabase.auth.signOut();

  if (error?.message) throw error;
}

export async function UpdateCourses(courses) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("Lecturers")
    .update({ courses })
    .eq("user_id", user.id);

  if (error?.message) {
    throw error;
  }
}

export async function UploadNewAssignment(details) {
  const { courseCode, assName, file } = details;

  const { error } = await supabase.storage
    .from("Courses")
    .upload(`${courseCode}/assignments/uploads/${assName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error?.message) throw error;
}

export async function UploadNewNote(details) {
  const { courseCode, noteName, file } = details;

  const { error } = await supabase.storage
    .from("Courses")
    .upload(`${courseCode}/notes/${noteName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error?.message) throw error;
}

export async function GetListOfAllFilesInFolder(path) {
  const { data, error } = await supabase.storage.from("Courses").list(path, {
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error?.message) throw error;

  return data;
}

export async function DownloadFile(filePath) {
  const { data, error } = await supabase.storage
    .from("Courses")
    .download(filePath);

  if (error?.message) throw error;

  return data;
}
