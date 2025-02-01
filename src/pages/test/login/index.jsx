import LogoImage from "../../../assets/svg/logo.svg";

function LoginTestPage() {
  return (
    <div className="flex w-full">
      <div className="w-1/2 bg-white">a</div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-b to-80% from-primary-900/70 to-primary-900">
        <div>
          <div className="size-18 flex justify-center items-center bg-primary-900 rounded-xl">
            <img src={LogoImage} alt="Logo" className="size-14" />
          </div>
        </div>
        <div className="w-10/12">
          <span className="text-white text-base leading-6">Tabulas</span>
          <p className="text-white text-base leading-8 font-light">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginTestPage;
