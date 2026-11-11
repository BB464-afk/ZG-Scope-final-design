import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  FolderOpen,
  CheckSquare,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Layers,
  Package,
  Ruler,
  Briefcase,
  Boxes,
  MapPin,
  DollarSign,
  Building2,
  Building,
  Wrench,
  UserCircle,
  FileText,
  Grid3x3,
  Clock
} from 'lucide-react';
import { OrangeFullLogo, IconOnlyLogo } from './Logo';
import ProfileDialog from './ProfileDialog';

// User Avatar Component
function UserAvatar() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, right: 0 });
  const avatarRef = React.useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDialogPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
      setShowProfileDialog(true);
    }
  };

  return (
    <>
      <div 
        ref={avatarRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleAvatarClick}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#4A90E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'transform 150ms ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          MG
        </div>
      </div>

      {/* Profile Dialog */}
      {showProfileDialog && (
        <ProfileDialog
          onClose={() => setShowProfileDialog(false)}
          position={dialogPosition}
        />
      )}
    </>
  );
}

export default function Layout() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeIndicatorTop, setActiveIndicatorTop] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleAccordion = (accordion: string) => {
    // Auto-collapse: only one accordion open at a time
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const isActive = (path: string) => {
    const normalizedPath = path === '/' ? '/app' : `/app${path}`;
    
    // For root path, check exact match or paths starting with /app/projects
    if (path === '/') {
      return location.pathname === '/app' || location.pathname.startsWith('/app/projects');
    }
    
    // For other paths, check exact match or sub-paths
    return location.pathname === normalizedPath || location.pathname.startsWith(normalizedPath + '/');
  };

  const isAccordionActive = (paths: string[]) => {
    return paths.some(path => isActive(path));
  };

  // Auto-open accordion if child is active
  useEffect(() => {
    if (isActive('/disciplines') || isActive('/scope') || isActive('/roc') || isActive('/general-settings/spa') || 
        isActive('/general-settings/subcontractor') || isActive('/general-settings/uom') || 
        isActive('/general-settings/location') || isActive('/general-settings/currency') || 
        isActive('/general-settings/client') || isActive('/general-settings/tp')) {
      setOpenAccordion('globalSettings');
    } else if (isActive('/general-settings/company') || isActive('/general-settings/profile')) {
      setOpenAccordion('generalSettings');
    }
  }, [location.pathname]);

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/app' || location.pathname.startsWith('/app/projects')) {
      return 'Projects';
    }
    // Approvals page
    if (location.pathname.startsWith('/app/approvals')) {
      return 'Access Approvals';
    }
    // Company Profile page
    if (location.pathname.startsWith('/app/general-settings/company')) {
      return 'Manage Zauner Group Detail';
    }
    // Global Settings pages
    if (location.pathname.startsWith('/app/disciplines') || 
        location.pathname.startsWith('/app/scope') ||
        location.pathname.startsWith('/app/general-settings/tp') ||
        location.pathname.startsWith('/app/general-settings/subcontractor') ||
        location.pathname.startsWith('/app/general-settings/uom') ||
        location.pathname.startsWith('/app/general-settings/currency') ||
        location.pathname.startsWith('/app/roc') ||
        location.pathname.startsWith('/app/general-settings/location') ||
        location.pathname.startsWith('/app/general-settings/client')) {
      return 'Global Settings';
    }
    // User Management pages
    if (location.pathname.startsWith('/app/users')) {
      return 'Global User Management';
    }
    // Audit Logs page
    if (location.pathname.startsWith('/app/audit-logs')) {
      return 'Global Audit Logs';
    }
    return '';
  };

  // Check if we're inside a project (not just the project listing)
  const isInsideProject = () => {
    // Match patterns like /app/projects/:id/* but not /app/projects or /app/projects/create
    const match = location.pathname.match(/^\/app\/projects\/(\d+)/);
    return match !== null;
  };

  // Calculate active indicator position
  useEffect(() => {
    const updateIndicatorPosition = () => {
      const activeElement = document.querySelector('[data-nav-active="true"]');
      if (activeElement) {
        const rect = activeElement.getBoundingClientRect();
        const navRect = document.querySelector('nav')?.getBoundingClientRect();
        if (navRect) {
          setActiveIndicatorTop(rect.top - navRect.top);
          setShowIndicator(true);
        }
      } else {
        setShowIndicator(false);
      }
    };

    updateIndicatorPosition();
    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicatorPosition, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, openAccordion, sidebarCollapsed]);

  const MenuItem = ({ 
    icon, 
    label, 
    path, 
    isChild = false 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    path: string; 
    isChild?: boolean;
  }) => {
    const active = isActive(path);
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
    const menuItemRef = React.useRef<HTMLDivElement>(null);
    
    const handleClick = () => {
      // Normalize path for navigation - add /app prefix if not root
      const fullPath = path === '/' ? '/app' : `/app${path}`;
      navigate(fullPath);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.08)';
      }
      if (menuItemRef.current && sidebarCollapsed) {
        const rect = menuItemRef.current.getBoundingClientRect();
        setTooltipPosition({ top: rect.top + rect.height / 2 });
      }
      setIsHovered(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
      setIsHovered(false);
    };
    
    return (
      <>
        <div
          ref={menuItemRef}
          data-nav-active={active}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: sidebarCollapsed ? '12px 0' : isChild ? '10px 16px 10px 40px' : '10px 16px',
            margin: sidebarCollapsed ? '0' : '0 8px',
            cursor: 'pointer',
            borderRadius: '6px',
            backgroundColor: active ? '#FD431426' : 'transparent',
            color: '#5F6B7A',
            fontSize: '14px',
            fontWeight: active ? '500' : '400',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            transition: 'background-color 200ms ease-in-out',
            position: 'relative'
          }}
        >
          {icon}
          {!sidebarCollapsed && <span>{label}</span>}
        </div>
        
        {/* Tooltip for collapsed mode - rendered via portal to avoid clipping */}
        {sidebarCollapsed && isHovered && createPortal(
          <div style={{
            position: 'fixed',
            left: '80px',
            top: tooltipPosition.top + 'px',
            transform: 'translateY(-50%)',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}>
            {label}
            <div style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderRight: '4px solid #FD4314'
            }} />
          </div>,
          document.body
        )}
      </>
    );
  };

  const AccordionMenuItem = ({
    icon,
    label,
    accordionKey,
    children
  }: {
    icon: React.ReactNode;
    label: string;
    accordionKey: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openAccordion === accordionKey;
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
    const accordionItemRef = React.useRef<HTMLDivElement>(null);
    
    const handleClick = () => {
      // If collapsed, expand the sidebar first
      if (sidebarCollapsed) {
        setSidebarCollapsed(false);
        // Don't auto-open the accordion, let user click again
        return;
      }
      toggleAccordion(accordionKey);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.08)';
      if (accordionItemRef.current && sidebarCollapsed) {
        const rect = accordionItemRef.current.getBoundingClientRect();
        setTooltipPosition({ top: rect.top + rect.height / 2 });
      }
      setIsHovered(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      setIsHovered(false);
    };
    
    return (
      <>
        <div>
          <div
            ref={accordionItemRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: sidebarCollapsed ? '12px 0' : '10px 16px',
              margin: sidebarCollapsed ? '0' : '0 8px',
              cursor: 'pointer',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#5F6B7A',
              fontSize: '14px',
              transition: 'background-color 200ms ease-in-out',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              flex: 1
            }}>
              {icon}
              {!sidebarCollapsed && <span>{label}</span>}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 200ms ease-in-out',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            )}
          </div>
          <div
            style={{
              overflow: 'hidden',
              transition: 'height 200ms ease-in-out',
              height: isOpen ? 'auto' : '0'
            }}
          >
            {isOpen && children}
          </div>
        </div>
        
        {/* Tooltip for collapsed mode - rendered via portal to avoid clipping */}
        {sidebarCollapsed && isHovered && createPortal(
          <div style={{
            position: 'fixed',
            left: '80px',
            top: tooltipPosition.top + 'px',
            transform: 'translateY(-50%)',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}>
            {label}
            <div style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderRight: '4px solid #FD4314'
            }} />
          </div>,
          document.body
        )}
      </>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#F5F6F8]" style={{ width: '1440px', height: '1024px', margin: '0 auto' }}>
      {/* Left Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? '72px' : '240px',
        backgroundColor: '#F3F6FA',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #E2E6ED',
        transition: 'width 300ms ease',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Logo Area */}
        <div style={{
          height: '96px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          position: 'relative'
        }}>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            {!sidebarCollapsed && (
              <div onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
                <OrangeFullLogo style={{ width: '540px', height: '144px' }} />
              </div>
            )}
            {sidebarCollapsed && (
              <div onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
                <IconOnlyLogo style={{ width: '40px', height: '40px' }} />
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5F6B7A',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8EBF0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          padding: '16px 0', 
          position: 'relative' 
        }}>
          {/* Active Indicator */}
          {showIndicator && !sidebarCollapsed && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: activeIndicatorTop,
                width: '4px',
                height: '40px',
                backgroundColor: '#FD4314',
                borderRadius: '0 4px 4px 0',
                transition: 'top 220ms cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10
              }}
            />
          )}

          {/* Expand Button (when collapsed) */}
          {sidebarCollapsed && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setSidebarCollapsed(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5F6B7A',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F3F5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* MAIN Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px'
              }}>
                MAIN
              </div>
            )}
            
            <MenuItem icon={<FolderOpen size={18} />} label="Projects" path="/" />
            <MenuItem icon={<CheckSquare size={18} />} label="Access Approvals" path="/approvals" />
          </div>

          {/* SETTINGS Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px'
              }}>
                SETTINGS
              </div>
            )}

            <AccordionMenuItem
              icon={<Settings size={18} />}
              label="Global Settings"
              accordionKey="globalSettings"
            >
              <MenuItem icon={<Layers size={18} />} label="Discipline Master" path="/disciplines" isChild />
              <MenuItem icon={<Grid3x3 size={18} />} label="Scope Master" path="/scope" isChild />
              <MenuItem icon={<Package size={18} />} label="ROC Library Master" path="/roc" isChild />
              <MenuItem icon={<Ruler size={18} />} label="TP Master" path="/general-settings/tp" isChild />
              <MenuItem icon={<Briefcase size={18} />} label="Sub-Contractor Master" path="/general-settings/subcontractor" isChild />
              <MenuItem icon={<Boxes size={18} />} label="UOM Master" path="/general-settings/uom" isChild />
              {/* Hidden for now - Country Master */}
              {/* <MenuItem icon={<MapPin size={18} />} label="Country Master" path="/general-settings/location" isChild /> */}
              {/* Hidden for now - Currency Master */}
              {/* <MenuItem icon={<DollarSign size={18} />} label="Currency Master" path="/general-settings/currency" isChild /> */}
              <MenuItem icon={<Building2 size={18} />} label="Client Master" path="/general-settings/client" isChild />
            </AccordionMenuItem>

            <AccordionMenuItem
              icon={<Wrench size={18} />}
              label="General Settings"
              accordionKey="generalSettings"
            >
              <MenuItem icon={<Building size={18} />} label="Company Profile" path="/general-settings/company" isChild />
              <MenuItem icon={<UserCircle size={18} />} label="My Profile" path="/general-settings/profile" isChild />
            </AccordionMenuItem>
          </div>

          {/* SYSTEM Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px'
              }}>
                SYSTEM
              </div>
            )}
            
            <MenuItem icon={<Users size={18} />} label="User Management" path="/users" />
            <MenuItem icon={<FileText size={18} />} label="Audit Logs" path="/audit-logs" />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div 
        onClick={() => {
          if (!sidebarCollapsed) {
            setSidebarCollapsed(true);
          }
        }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
        {/* Top Bar */}
        <header style={{
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E6ED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            
            {getPageTitle() && (
              <>
                
                <span style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1F2937'
                }}>
                  {getPageTitle()}
                </span>
                
                {/* Show timezone badge when inside a project */}
                {isInsideProject() && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: '#E4EEFE',
                    border: '1px solid #C8D9EE',
                    borderRadius: '4px'
                  }}>
                    <Clock size={13} style={{ color: '#5F6B7A' }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#5F6B7A' }}>CET (Central European Time, UTC+01:00)</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* User Avatar */}
            <UserAvatar />
          </div>
        </header>

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#F7F9FC'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}