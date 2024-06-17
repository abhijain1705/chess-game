"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// ** Third Party Imports
import toast from "react-hot-toast";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

interface ResetPasswordForm {
  newPassword: string;
}

const ResetPassword = ({
  params: { token },
}: {
  params: { token: string };
}) => {
  const schema = yup.object().shape({
    newPassword: yup.string().min(8).required("Password is required"),
  });

  const defaultValues: ResetPasswordForm = {
    newPassword: "",
  };

  const route = useRouter();

  useEffect(() => {
    if (token === undefined) {
      route.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  async function onSubmit(data: ResetPasswordForm) {
    setloader(true);

    try {
      const response = await fetch("/api/resetPassword", {
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
            token: token,
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
              Reset Password
            </h1>
            <form
              noValidate
              autoComplete="off"
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <Controller
                  name="newPassword"
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
                        name="newPassword"
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id="newPassword"
                        required={true}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="******"
                        aria-describedby="validation-schema-first-name"
                        {...(errors.newPassword && {
                          helperText: errors.newPassword.message,
                        })}
                      />
                      {errors && (
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-red-500 "
                        >
                          {errors.newPassword?.message}
                        </label>
                      )}
                    </>
                  )}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#b26e41] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Save Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const queryParams = context.query;

//   try {
//     return {
//       props: { params: queryParams },
//     };
//   } catch (error) {
//     console.error("Error fetching diamond data:", error);
//     return {
//       props: { params: queryParams },
//     };
//   }
// };

export default ResetPassword;
