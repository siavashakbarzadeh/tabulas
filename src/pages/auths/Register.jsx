import React, {useState, useEffect} from "react";
import { Head, Button, CheckBox, Form, Icon, Input } from "../../componenets";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import { Menu } from "@headlessui/react";
import { usePopper } from 'react-popper';
import { useTheme } from "../../layout/context";

const LanguageDropdown = ({className}) => {
    const theme = useTheme();
    let [dropdownToggle, setDropdownToggle] = useState()
    let [dropdownContent, setDropdownContent] = useState()
    let { styles, attributes } = usePopper(dropdownToggle, dropdownContent, {
        placement : theme.direction === "rtl" ? "bottom-start" : "bottom-end",
        modifiers: [
            {name: 'offset', options: { offset: [0, 0]}},
            {name: 'preventOverflow', options: { padding: 8 }},
        ],
    })
  return (
    <Menu as="div" className={`inline-flex relative ${className ? className : ''}`}>
        {({ open }) => (
            <>
                <Menu.Button as='div' className={`inline-flex${open ? ' active' : ''}`} ref={setDropdownToggle}>
                    <button className="inline-flex items-center text-xs leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 p-3">
                        <span>English</span> 
                        <Icon className="text-sm ms-1" name="chevron-up" />
                    </button>
                </Menu.Button>
                <Menu.Items modal={false} ref={setDropdownContent} style={styles.popper} {...attributes.popper} className="absolute border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-md shadow z-[1000] min-w-[140px]">
                    <ul>
                        <li className="first:rounded-t-md last:rounded-b-md first:border-t-0 border-t border-gray-200 dark:border-gray-800">
                            <Menu.Item as="button" className="w-full relative px-5 py-2.5 flex items-center rounded-[inherit] text-xs leading-5 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 hover:dark:bg-gray-900 transition-all duration-300">
                                <img src="/images/flags/english.png" alt="" className="w-6 me-3" />
                                <span>English</span>
                            </Menu.Item>
                        </li>
                        <li className="first:rounded-t-md last:rounded-b-md first:border-t-0 border-t border-gray-200 dark:border-gray-800">
                            <Menu.Item as="button" className="w-full relative px-5 py-2.5 flex items-center rounded-[inherit] text-xs leading-5 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 hover:dark:bg-gray-900 transition-all duration-300">
                                <img src="/images/flags/spanish.png" alt="" className="w-6 me-3" />
                                <span>Español</span>
                            </Menu.Item>
                        </li>
                        <li className="first:rounded-t-md last:rounded-b-md first:border-t-0 border-t border-gray-200 dark:border-gray-800">
                            <Menu.Item as="button" className="w-full relative px-5 py-2.5 flex items-center rounded-[inherit] text-xs leading-5 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 hover:dark:bg-gray-900 transition-all duration-300">
                                <img src="/images/flags/french.png" alt="" className="w-6 me-3" />
                                <span>Français</span>
                            </Menu.Item>
                        </li>
                        <li className="first:rounded-t-md last:rounded-b-md first:border-t-0 border-t border-gray-200 dark:border-gray-800">
                            <Menu.Item as="button" className="w-full relative px-5 py-2.5 flex items-center rounded-[inherit] text-xs leading-5 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:bg-slate-50 hover:dark:bg-gray-900 transition-all duration-300">
                                <img src="/images/flags/turkey.png" alt="" className="w-6 me-3" />
                                <span>Türkçe</span>
                            </Menu.Item>
                        </li>
                    </ul>
                </Menu.Items>
            </>
        )}
    </Menu>
  )
}

const RegisterPage = () => {
  const [passwordState, setPasswordState] = useState(false);
  const [pageAside, setPageAside] = useState(false);

  useEffect(() => {
    const handleAside = () => {
        if (window.innerWidth > 1023) {
          setPageAside(false);
        }
    }

    handleAside();
    window.addEventListener('resize', handleAside);
    return () => {
     window.removeEventListener('resize', handleAside);
    };
  }, []);
  return (
    <> 
        <Head title="Registration" />
        <div className="relative flex min-h-screen">
            <div className="relative flex flex-col min-h-full bg-white dark:bg-gray-950 w-full lg:w-[45%] flex-shrink-0">
                <div className="absolute lg:hidden top-0 end-0 p-5 sm:p-11 z-10">
                    <Button  onClick={()=>{
                        setPageAside(!pageAside)
                    }} icon size="rg" variant="white-outline"><Icon className="text-xl" name="info" /></Button>
                </div>

                <div className="m-auto w-full max-w-[420px] p-5 2xl:me-[90px]">
                    <div className="relative flex flex-shrink-0 pb-11">
                        <Link to="/" className="relative inline-block transition-opacity duration-300 h-10">
                            <img className="h-full opacity-0 dark:opacity-100" src="/logo.png" srcSet="/logo2x.png 2x" alt="logo" />
                            <img className="h-full opacity-100 dark:opacity-0 absolute start-0 top-0" src="/logo-dark.png" srcSet="/logo-dark2x.png 2x" alt="logo" />
                        </Link>
                    </div>
                    <div className="pb-5">
                        <h5 className="text-xl font-heading font-bold -tracking-snug text-slate-700 dark:text-white leading-tighter mb-2">Register</h5>
                        <p className="text-sm leading-6 text-slate-400">Create New DashWind Account</p>
                    </div>
                    <form action="#">
                        <Form.Group>
                            <Form.Label className="flex justify-between items-center mb-2" htmlFor="fullName">
                                <span>Name </span>
                            </Form.Label>
                            <Input.Wrap>
                                <Input id="fullName" placeholder="Enter your name" autoComplete="off" size="lg" />
                            </Input.Wrap>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="flex justify-between items-center mb-2" htmlFor="emailAddress">
                                <span>Email or Username </span>
                            </Form.Label>
                            <Input.Wrap>
                                <Input id="emailAddress" placeholder="Enter your email address or username" autoComplete="off" size="lg" />
                            </Input.Wrap>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="flex justify-between items-center mb-2" htmlFor="password">
                                <span>Passcode </span>
                            </Form.Label>
                            <Input.Wrap>
                                <a tabIndex="-1" href="#password" onClick={(ev) => {
                                    ev.preventDefault();
                                    setPasswordState(!passwordState);
                                    }} className={`absolute h-11 w-11 top-0 end-0 flex items-center justify-center js-password-toggle group/password ${passwordState ? "" : "is-shown"}`}>
                                    <em className="group-[.is-shown]/password:hidden text-slate-400 text-base leading-none ni ni-eye"></em>
                                    <em className="hidden group-[.is-shown]/password:block text-slate-400 text-base leading-none ni ni-eye-off"></em>
                                </a>
                                <Input id="password" type={passwordState ? "text" : "password"} placeholder="Enter your passcode" autoComplete="off" size="lg" />
                            </Input.Wrap>
                        </Form.Group>
                        <Form.Group className="flex">
                            <CheckBox id="checkAgree">
                            I agree to DashWind <Link className="text-primary-500 hover:text-primary-600 transition-all duration-300" to="/terms-policy">Privacy Policy</Link> &amp; <Link className="text-primary-500 hover:text-primary-600 transition-all duration-300" to="/terms-policy">Terms</Link>.
                            </CheckBox>
                        </Form.Group>
                        <Form.Group>
                            <Button as="Link" to="/auths/auth-login" size="lg" variant="primary" block>Register</Button>
                        </Form.Group>
                    </form>
                    <div className="pt-6"> 
                        Already have an account ?
                        <Link className="text-primary-500 hover:text-primary-600 font-medium transition-all duration-300 " to="/auths/auth-login"> Sign in instead</Link>
                    </div>
                    <div className="text-center pt-6 pb-4">
                        <h6 className="text-slate-300 whitespace-nowrap uppercase font-bold text-xxs tracking-relaxed leading-tight px-1.5 inline-block relative before:absolute before:h-px before:w-5 before:bg-slate-300 before:top-1/2 before:-translate-y-1/2 before:end-full after:absolute after:h-px after:w-5 after:bg-slate-300 after:top-1/2 after:-translate-y-1/2 after:start-full">Or</h6>
                    </div>
                    <ul className="flex flex-wrap justify-center gap-x-6">
                        <li>
                            <a className="inline-flex text-sm leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 px-4 py-3" href="#link" onClick={(e)=> e.preventDefault()}>Facebook</a>
                        </li>
                        <li>
                            <a className="inline-flex text-sm leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 px-4 py-3" href="#link" onClick={(e)=> e.preventDefault()}>Google</a>
                        </li>
                    </ul>
                </div>
                <div className="mx-auto w-full max-w-[420px] px-5 pt-7 pb-10 2xl:me-[90px]">
                    <ul className="flex flex-wrap items-center -m-3 relative">
                        <li>
                            <Link className="inline-flex text-sm leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 p-3" to="/terms-policy">Terms &amp; Condition</Link>
                        </li>
                        <li>
                            <Link className="inline-flex text-sm leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 p-3" to="/terms-policy">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link className="inline-flex text-sm leading-none whitespace-nowrap transition-all duration-300 font-normal font-body text-primary-600 hover:text-primary-700 p-3" to="/faqs">Help</Link>
                        </li>
                        <li>
                            <LanguageDropdown />
                        </li>
                    </ul>
                    <div className="mt-4.5">
                        <p>&copy; 2024 DashWind. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
            <div id="pageAside" className={`peer min-w-[260px] max-w-[calc(100%-2.5rem)] flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex-shrink flex-grow fixed lg:static top-0 end-0 z-[999] transition-transform duration-500 lg:transition-none translate-x-full rtl:-translate-x-full [&.active]:transform-none lg:transform-none lg:rtl:transform-none ${pageAside ? "active" : ''}`}>
                <div className="m-auto w-full max-w-[550px] p-4 sm:p-11">
                    <Swiper
                    dir="rtl"
                    modules={[Pagination]}
                    pagination={{clickable: true}}
                    slidesPerView={1}
                    className="[&>.swiper-pagination]:relative [&>.swiper-pagination]:flex [&>.swiper-pagination]:justify-center [&>.swiper-pagination]:gap-1 [&>.swiper-pagination]:pt-6 [&>.swiper-pagination_.swiper-pagination-bullet]:bg-gray-300 [&>.swiper-pagination_.swiper-pagination-bullet]:opacity-100 [&>.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:bg-slate-400"
                    >
                        <SwiperSlide>
                            <div className="text-center">
                                <img src="/images/slides/promo-a.png" srcSet="/images/slides/promo-a2x.png 2x" alt="" />
                                <div className="py-6 sm:p-11">
                                    <h4 className="text-xl lg:text-2xl font-heading font-bold -tracking-tight text-slate-700 dark:text-white leading-tighter mb-2">DashWind</h4>
                                    <p>You can start to create your products easily with its user-friendly design &amp; most completed responsive layout.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="text-center">
                                <img src="/images/slides/promo-b.png" srcSet="/images/slides/promo-b2x.png 2x" alt="" />
                                <div className="py-6 sm:p-11">
                                    <h4 className="text-xl lg:text-2xl font-heading font-bold -tracking-tight text-slate-700 dark:text-white leading-tighter mb-2">DashWind</h4>
                                    <p>You can start to create your products easily with its user-friendly design &amp; most completed responsive layout.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="text-center">
                                <img src="/images/slides/promo-c.png" srcSet="/images/slides/promo-c2x.png 2x" alt="" />
                                <div className="py-6 sm:p-11">
                                    <h4 className="text-xl lg:text-2xl font-heading font-bold -tracking-tight text-slate-700 dark:text-white leading-tighter mb-2">DashWind</h4>
                                    <p>You can start to create your products easily with its user-friendly design &amp; most completed responsive layout.</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <div onClick={()=>{
                setPageAside(false)
            }} className="class-toggle fixed inset-0 bg-slate-950 bg-opacity-20 z-[900] opacity-0 invisible peer-[.active]:opacity-100 peer-[.active]:visible lg:!opacity-0 lg:!invisible"></div>
        </div>
    </>
  );
};
export default RegisterPage;
