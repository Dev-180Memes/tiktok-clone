import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineLogout } from 'react-icons/ai';
import { googleLogout, GoogleLogin } from '@react-oauth/google';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';

import logo from '../utils/tiktik-logo.png';
import { createOrGetUser } from '@/utils';
import useAuthStore from '@/store/authStore';
import { IUser } from '@/types';

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>();
  const { userProfile, addUser, removeUser } = useAuthStore();
  const route = useRouter();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if(searchValue) {
      route.push(`/search/${searchValue}`);
    }
  }

  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
        <Link href="/">
            <div className='w-[100px] md:w-[130px]'>
                <Image 
                    className='cursor-pointer'
                    src={logo}
                    alt='logo'
                    layout='responsive'
                />
            </div>
        </Link>

        <div className='relative hidden md:block'>
          <form onSubmit={handleSearch} className="absolute md:static top-10 -left-20 bg-white">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full  md:top-0"
              placeholder='Search Accounts and Videos'
            />
            <button
              onClick={handleSearch}
              className="absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
            >
              <BiSearch />
            </button>
          </form>
        </div>

        <div>
          {user ? (
            <div className='flex gap-5 md:gap-10'>
              <Link href="/upload">
                <button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
                  <IoMdAdd className='text-xl'/>{" "}
                  <span className="hidden md:block">Upload</span>
                </button>
              </Link>
              {user.image && (
                <Link href={`/profile/${user._id}`}>
                  <div>
                    <Image 
                      src={user.image}
                      className="rounded-full cursor-pointer"
                      alt='user'
                      width={40}
                      height= {40}
                    />
                  </div>
                </Link>
              )}
              <button 
                type='button'
                className='border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                onClick={() => {
                  googleLogout()
                  removeUser()
                }}
              >
                <AiOutlineLogout color='red' fontSize={21} />
              </button>
            </div>
          ) : (
            <GoogleLogin 
              onSuccess={(res) => createOrGetUser(res, addUser)}
              onError={() => console.log("Login Failed")}
            />
          )}
        </div>
    </div>
  )
}

export default Navbar