import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const PasswordInput = ({
  register,
  name,
  registerOptions = {},
  placeholder,
  className = "",
  error,
}) => {
  const [visible, setVisible] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const { onChange: registerOnChange, ...registerRest } = register(
    name,
    registerOptions,
  );

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    registerOnChange(e);
  };

  return (
    <div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          {...registerRest}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-luxe pr-11 ${className}`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-1">{error.message}</p>}
    </div>
  );
};

export default PasswordInput;
