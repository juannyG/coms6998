const Register = () => {
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <label className="form-control flex self-stretch">
          <div className="label">
            <span className="label-text text-sm font-medium text-left text-gray-700">Username</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered min-h-11 h-11 rounded-md w-full self-stretch"
          />
        </label>
      </div>
      <button className="btn rounded-md bg-indigo-600 hover:bg-indigo-400 flex self-stretch text-white font-normal min-h-10 h-10">
        Enter Spotlight
      </button>
    </>
  );
};

export default Register;
