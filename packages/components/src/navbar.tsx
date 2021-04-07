import React, { useContext, useState, useEffect, createContext } from "react";
import cls from "classnames";

import "./hamburger.css";

const navbarContextState = {
  isOpen: false,
  toggleOpen: () => {},
  setOpen: (_open: boolean) => {},
};

export const NavbarContext = createContext(navbarContextState);

export const NavbarContextProvider: React.FC = ({ children }) => {
  const toggleOpen = () =>
    setNavbarValue((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));

  const setOpen = (open: boolean) =>
    setNavbarValue((prevState) => ({ ...prevState, isOpen: open }));

  const [navbarValue, setNavbarValue] = useState({
    ...navbarContextState,
    toggleOpen,
    setOpen,
  });

  return (
    <NavbarContext.Provider value={navbarValue}>
      {children}
    </NavbarContext.Provider>
  );
};

interface NavLink {
  title: string;
  path: string;
}

type Variant = "light" | "dark";

export interface LinkProps {
  to: string;
  variant: Variant;
}

interface NavLinksProps {
  Link: React.FC<LinkProps>;
  className?: string;
  variant: Variant;
  links: NavLink[];
}

const NavLinks: React.FC<NavLinksProps> = ({
  Link,
  className,
  links,
  variant,
}) => {
  const { setOpen } = useContext(NavbarContext);

  return (
    <>
      {links.map((navItem) => (
        <li
          className={className}
          key={navItem.title}
          onClick={() => setOpen(false)}
        >
          <Link to={navItem.path} variant={variant}>
            {navItem.title}
          </Link>
        </li>
      ))}
    </>
  );
};

export interface NavbarProps {
  variant?: Variant;
  links: NavLink[];
  // TODO kick any
  Link: any;
  UnstyledLink: any;
  CTAButton: any;
  Brand: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  Link,
  UnstyledLink,
  links,
  CTAButton,
  Brand,
  ...props
}) => {
  const { isOpen, toggleOpen, setOpen } = useContext(NavbarContext);
  const [atTopOfPage, setAtTopOfPage] = useState(true);
  const variant = isOpen ? "light" : atTopOfPage ? props.variant! : "light";

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        if (atTopOfPage) setAtTopOfPage(false);
      } else {
        if (!atTopOfPage) setAtTopOfPage(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [atTopOfPage]);

  const MobileMenu: React.FC = () => (
    <div
      className={cls(
        "h-screen w-screen max-w-full bg-white items-center justify-center align-center container flex flex-col",
        {
          hidden: !isOpen,
          flex: isOpen,
        }
      )}
    >
      <ul className="w-full text-center">
        <NavLinks
          Link={Link}
          className="mb-4"
          links={links}
          variant={variant}
        />
      </ul>
      {React.cloneElement(CTAButton, { className: "w-full" })}
    </div>
  );

  return (
    <header className="fixed z-20 w-full">
      {/* DESKTOP */}
      <nav
        className={cls(
          "hidden lg:flex px-4 lg:px-8 py-5 m-w-xl items-center border-t-4 transition duration-500 ease-in-out",
          {
            "bg-transparent border-transparent text-white": atTopOfPage,
            "bg-white border-primary text-black shadow-lg": !atTopOfPage,
          }
        )}
      >
        <div className="flex-1">
          <Brand />
        </div>
        <ul className="flex">
          <NavLinks
            links={links}
            Link={Link}
            variant={variant}
            className="mr-8"
          />
        </ul>
        {CTAButton}
      </nav>
      {/* MOBILE */}
      <nav
        className={cls(
          "flex px-4 lg:hidden z-20 relative py-4 m-w-xl items-center border-t-4 transition duration-500 ease-in-out",
          {
            "bg-white shadow-sm border-primary":
              variant === "light" && (!atTopOfPage || isOpen),
            "bg-transparent border-transparent text-white": variant === "dark",
            "border-transparent text-black":
              variant === "light" && atTopOfPage && !isOpen,
          }
        )}
      >
        <div className="flex-1">
          <Brand onClick={() => setOpen(false)} />
        </div>
        <button
          className={cls("hamburger hamburger--slider", {
            "is-active": isOpen,
          })}
          onClick={toggleOpen}
        >
          <span className="hamburger-box top-[3px]">
            <span
              className={cls("hamburger-inner", {
                "bg-white": !isOpen || variant === "dark",
                "bg-black": isOpen || variant === "light",
              })}
            ></span>
          </span>
        </button>
      </nav>
      <MobileMenu />
    </header>
  );
};

Navbar.defaultProps = { variant: "dark" };
