import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";

function Dropdown({
  trigger,
  children,
  className = "",
  closeOnSelect = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    if (closeOnSelect) setIsOpen(false);
  };

  // Animate height for slide down/up effect, and opacity for fade
  const variants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className={`relative inline-block  ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between text-nowrap"
      >
        {trigger}{" "}
        {!isOpen ? (
          <RiArrowDownSLine className="text-lg sm:text-[16px]" />
        ) : (
          <RiArrowUpSLine className="text-lg sm:text-[16px]" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            style={{ overflow: "hidden" }}
            className=" rounded"
          >
            {React.Children.map(children, (child) => {
              // Get existing child's onClick
              const childOnClick = child.props.onClick;

              // Create a new onClick that calls both child and dropdown close
              const newOnClick = (event) => {
                if (childOnClick) childOnClick(event);
                handleItemClick();
              };

              // Return cloned child with merged onClick
              return React.cloneElement(child, { onClick: newOnClick });
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
