import React from "react";
import { Link } from "react-router-dom";
// Helper components
export const MenuItem = ({ to, href, icon: Icon, children, badge, onClick }) => {
  const normalizeInternalPath = () => {
    if (!href) return null;

    try {
      const url = new URL(href, window.location.origin);
      const sameSiteHosts = new Set([
        "locketqq.online",
        "www.locketqq.online",
      ]);
      const legacyHosts = new Set([
        "locket-qqit.vercel.app",
        "locket-qq.com",
        "www.locket-qq.com",
      ]);

      if (
        url.origin === window.location.origin ||
        sameSiteHosts.has(url.hostname) ||
        legacyHosts.has(url.hostname)
      ) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch (error) {
      return null;
    }

    return null;
  };

  const internalPath = to || normalizeInternalPath();
  const className = `flex items-center px-3 py-2.5 mb-1 rounded-lg transition ${internalPath && location.pathname === internalPath
    ? "bg-base-300"
    : "hover:bg-base-200"
    }`;

  const content = (
    <>
      <Icon size={22} /> {children}
      {badge && (
        <div className="badge badge-sm badge-secondary ml-auto">{badge}</div>
      )}
    </>
  );

  return (
    <li>
      {internalPath ? (
        <Link to={internalPath} className={className} onClick={onClick}>
          {content}
        </Link>
      ) : href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
          {content}
        </a>
      ) : (
        <Link to={to} className={className} onClick={onClick}>
          {content}
        </Link>
      )}
    </li>
  );
};
