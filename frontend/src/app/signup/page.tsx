"use client";
import Image from "next/image";
import { useState } from "react";

// ** Third Party Imports
import toast from "react-hot-toast";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    name: yup.string().min(4).required("Name is required"),
    password: yup.string().min(8).required("Password is required"),
  });

  const defaultValues: SignupForm = {
    email: "",
    name: "",
    password: "",
  };

  // form context
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [loader, setloader] = useState(false);

  async function onSubmit(data: SignupForm) {
    setloader(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            username: data.email.split("@")[0],
          }),
        }),
      });

      if (response.status === 200) {
        const res = await response.json();
        toast.success(res.message);
      } else {
        const res = await response.json();
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setloader(false);
    }
  }

  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-end mb-6 text-2xl font-semibold text-gray-900 "
        >
          <Image
            className="mr-2"
            width={150}
            height={40}
            src="/logo.png"
            alt="logo"
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign up to your account
            </h1>
            <form
              noValidate
              autoComplete="off"
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id="name"
                        required={true}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="Abhi Jain"
                        aria-describedby="validation-schema-first-name"
                        {...(errors.name && {
                          helperText: errors.name.message,
                        })}
                      />
                      {errors && (
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-red-500 "
                        >
                          {errors.name?.message}
                        </label>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id="email"
                        required={true}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="mymail@mail.com"
                        aria-describedby="validation-schema-first-name"
                        {...(errors.email && {
                          helperText: errors.email.message,
                        })}
                      />
                      {errors && (
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-red-500 "
                        >
                          {errors.email?.message}
                        </label>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id="password"
                        required={true}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="******"
                        aria-describedby="validation-schema-first-name"
                        {...(errors.password && {
                          helperText: errors.password.message,
                        })}
                      />
                      {errors && (
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-red-500 "
                        >
                          {errors.password?.message}
                        </label>
                      )}
                    </>
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={loader}
                className="w-full text-white bg-[#b26e41] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loader ? "Please wait..." : "Sign up"}
              </button>
              <p className="text-sm font-light text-gray-500 ">
                Already have an account yet?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline "
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
