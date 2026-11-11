import React, { useState, useEffect } from 'react';
import { Home, ListTodo, TrendingUp, CheckSquare, FileText, Settings, User, ChevronLeft, ChevronRight, LogOut, ChevronDown, Building2, Layers, Grid3x3, ListChecks, Clock, Save, Link2 } from 'lucide-react';
import { OrangeFullLogo, IconOnlyLogo } from './Logo';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router';
import CloseProjectModal from './CloseProjectModal';
import ProfileDialog from './ProfileDialog';

// Google logo SVG component (fallback if image not available)
const GoogleLogoSVG = () => (
  <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function ProjectLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [activeIndicatorTop, setActiveIndicatorTop] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const [showCloseTooltip, setShowCloseTooltip] = useState(false);
  const [closeTooltipPosition, setCloseTooltipPosition] = useState({ top: 0 });
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, right: 0 });
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closeButtonRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  // Project mapping - get project name based on projectId
  const projectMapping: Record<string, string> = {
    '9': 'Google Data Center – Norway',
    '1': 'North Terminal Expansion',
    '2': 'Offshore Platform Alpha',
    '3': 'Highway Infrastructure Upgrade',
    '4': 'Residential Complex Phase 2',
    '5': 'Water Treatment Facility',
    '6': 'Data Center Construction',
    '7': 'Bridge Restoration Project',
    '8': 'Metro Line Extension',
    '10': 'Smart City Initiative',
    '11': 'Solar Farm Development'
  };

  // Project status mapping
  const projectStatusMapping: Record<string, 'Active' | 'On Hold' | 'Completed' | 'Archived'> = {
    '9': 'Active',
    '1': 'Active',
    '2': 'Active',
    '3': 'Active',
    '4': 'Active',
    '5': 'On Hold',
    '6': 'Active',
    '7': 'Active',
    '8': 'Active',
    '10': 'Active',
    '11': 'Active'
  };

  const projectName = projectId ? projectMapping[projectId] || 'Unknown Project' : 'Google Data Center - Norway';
  const projectStatus = projectId ? projectStatusMapping[projectId] || 'Active' : 'Active';
  const isProjectReadOnly = projectStatus !== 'Active';

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const isActive = (path: string) => {
    // For "Projects" path, only match exact /app route
    if (path === '/app') {
      return location.pathname === '/app';
    }
    
    // For all other paths, check exact match or sub-paths
    return location.pathname === path || location.pathname.startsWith(path + '/');
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
    const timer = setTimeout(updateIndicatorPosition, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, sidebarCollapsed]);

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
          onClick={() => navigate(path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: sidebarCollapsed ? '12px 0' : isChild ? '10px 16px 10px 40px' : '10px 16px',
            margin: sidebarCollapsed ? '0' : '0 8px',
            cursor: 'pointer',
            borderRadius: '6px',
            backgroundColor: active ? '#FD431426' : 'transparent',
            color: active ? '#FD4314' : '#5F6B7A',
            fontSize: '14px',
            fontWeight: active ? '500' : '400',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            transition: 'background-color 200ms ease-in-out',
            position: 'relative'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {icon}
          {!sidebarCollapsed && <span>{label}</span>}
        </div>

        {/* Tooltip for collapsed mode - rendered outside to avoid positioning issues */}
        {sidebarCollapsed && isHovered && (
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
          </div>
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
      if (sidebarCollapsed) {
        setSidebarCollapsed(false);
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
        <div style={{ margin: sidebarCollapsed ? '0' : '0 8px' }}>
          <div
            ref={accordionItemRef}
            onClick={handleClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: sidebarCollapsed ? '12px 0' : '10px 16px',
              cursor: 'pointer',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#5F6B7A',
              fontSize: '14px',
              fontWeight: '400',
              transition: 'background-color 200ms ease-in-out'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 200ms ease'
                }}
              />
            )}
          </div>

          {isOpen && !sidebarCollapsed && (
            <div style={{
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              {children}
            </div>
          )}
        </div>

        {sidebarCollapsed && isHovered && (
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
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#F5F6F8]" style={{ width: '1440px', height: '1024px', margin: '0 auto' }}>
      {/* Left Sidebar - Project Mode */}
      <aside style={{
        width: sidebarCollapsed ? '72px' : '240px',
        backgroundColor: '#F3F6FA',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #E2E6ED',
        transition: 'width 300ms ease, background-color 300ms ease',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Logo Area with Toggle */}
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
              <OrangeFullLogo 
                onClick={() => navigate('/app')}
                style={{ 
                  height: '720px',
                  width: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            )}
            {sidebarCollapsed && (
              <IconOnlyLogo 
                onClick={() => navigate('/app')}
                style={{ 
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  cursor: 'pointer'
              }} 
            />
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

          {/* HOME Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px',
                transition: 'color 300ms ease'
              }}>
                HOME
              </div>
            )}
            
            <MenuItem icon={<Home size={18} />} label="Projects" path="/app" />
            <MenuItem icon={<TrendingUp size={18} />} label="Project Dashboard" path={`/app/projects/${projectId}/dashboard`} />
          </div>

          {/* TASKS WIZARD Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px',
                transition: 'color 300ms ease'
              }}>
                TASKS WIZARD
              </div>
            )}
            
            <MenuItem icon={<ListTodo size={18} />} label="All Tasks" path={`/app/projects/${projectId}/tasks`} />
            <AccordionMenuItem
              icon={<CheckSquare size={18} />}
              label="Project Approvals"
              accordionKey="projectApprovals"
            >
              <MenuItem icon={<Clock size={18} />} label="Progress Approvals" path={`/app/projects/${projectId}/progress-approvals`} isChild />
              <MenuItem icon={<User size={18} />} label="Project Access Approvals" path={`/app/projects/${projectId}/access-approvals`} isChild />
            </AccordionMenuItem>
          </div>

          {/* REPORTING Section */}
          <div style={{ marginBottom: '24px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                letterSpacing: '0.5px',
                padding: '0 16px',
                marginBottom: '8px',
                transition: 'color 300ms ease'
              }}>
                REPORTING
              </div>
            )}
            
            <AccordionMenuItem
              icon={<FileText size={18} />}
              label="All Reports"
              accordionKey="allReports"
            >
              <MenuItem icon={<FileText size={18} />} label="Generate Report" path={`/app/projects/${projectId}/reports/generate`} isChild />
              <MenuItem icon={<FileText size={18} />} label="Activity-Task Report" path={`/app/projects/${projectId}/reports/activity-task`} isChild />
              <MenuItem icon={<Save size={18} />} label="Saved Report" path={`/app/projects/${projectId}/reports/saved`} isChild />
            </AccordionMenuItem>
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
                marginBottom: '8px',
                transition: 'color 300ms ease'
              }}>
                SETTINGS
              </div>
            )}
            
            <AccordionMenuItem
              icon={<Settings size={18} />}
              label="Project Settings"
              accordionKey="projectSettings"
            >
              <MenuItem icon={<Building2 size={18} />} label="Project Details" path={`/app/projects/${projectId}/settings/details`} isChild />
              <MenuItem icon={<Layers size={18} />} label="Project Scope" path={`/app/projects/${projectId}/settings/scope`} isChild />
              <MenuItem icon={<Grid3x3 size={18} />} label="Coding Dimensions" path={`/app/projects/${projectId}/settings/dimensions`} isChild />
              <MenuItem icon={<ListChecks size={18} />} label="Project Activities" path={`/app/projects/${projectId}/settings/activities`} isChild />
              <MenuItem icon={<Link2 size={18} />} label="Drawing Links" path={`/app/projects/${projectId}/settings/drawing-links`} isChild />
            </AccordionMenuItem>

            <MenuItem icon={<User size={18} />} label="Project Users" path={`/app/projects/${projectId}/users`} />
          </div>

          {/* Close Project Button */}
          <div style={{ padding: '0 8px' }}>
            <div
              ref={closeButtonRef}
              onClick={() => setShowCloseModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed ? '12px 0' : '10px 16px',
                margin: sidebarCollapsed ? '0' : '0',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#DC2626',
                fontSize: '14px',
                fontWeight: '500',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                transition: 'background-color 200ms ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
                if (closeButtonRef.current && sidebarCollapsed) {
                  const rect = closeButtonRef.current.getBoundingClientRect();
                  setCloseTooltipPosition({ top: rect.top + rect.height / 2 });
                }
                setShowCloseTooltip(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                setShowCloseTooltip(false);
              }}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span>Close Project</span>}
            </div>
          </div>
        </nav>

        {/* Bottom Fixed Section - Project Context */}
        {!sidebarCollapsed && (
          <div style={{
            borderTop: '1px solid #E2E6ED',
            padding: '16px',
            backgroundColor: '#F3F6FA'
          }}>
            <div 
              onClick={() => navigate(`/app/projects/${projectId}/settings/details`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '8px',
                margin: '-8px',
                borderRadius: '4px',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: '4px'
              }}>
                <GoogleLogoSVG />
              </div>
              <div style={{
                flex: 1,
                overflow: 'hidden'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'color 300ms ease'
                }}>
                  {projectName}
                </div>
                <div style={{
                  marginTop: '4px'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: projectStatus === 'Active' ? '#10B981' : projectStatus === 'On Hold' ? '#F59E0B' : projectStatus === 'Completed' ? '#3B82F6' : '#6B7280',
                    backgroundColor: projectStatus === 'Active' ? 'rgba(16, 185, 129, 0.1)' : projectStatus === 'On Hold' ? 'rgba(245, 158, 11, 0.1)' : projectStatus === 'Completed' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    border: projectStatus === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : projectStatus === 'On Hold' ? '1px solid rgba(245, 158, 11, 0.2)' : projectStatus === 'Completed' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(107, 114, 128, 0.2)'
                  }}>
                    {projectStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
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
            gap: '12px'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#1F2937'
            }}>
              {projectName}
            </div>
            
            {/* Timezone Badge */}
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
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div
              ref={avatarRef}
              onClick={() => {
                if (avatarRef.current) {
                  const rect = avatarRef.current.getBoundingClientRect();
                  setDialogPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                  });
                  setShowProfileDialog(true);
                }
              }}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#4A90E2',
                borderRadius: '50%',
                cursor: 'pointer',
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
        </header>

        {/* Read-Only Banner */}
        {isProjectReadOnly && (
          <div style={{
            padding: '12px 32px',
            backgroundColor: '#FEF3C7',
            borderBottom: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <Clock size={16} style={{ color: '#92400E', flexShrink: 0 }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#92400E'
            }}>
              This project is currently in {projectStatus}. All actions are disabled. You can only view data.
            </span>
          </div>
        )}

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#F7F9FC'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Close Project Modal */}
      {showCloseModal && (
        <CloseProjectModal 
          projectName={projectName}
          onClose={() => setShowCloseModal(false)}
        />
      )}

      {/* Close Project Tooltip */}
      {showCloseTooltip && (
        <div style={{
          position: 'fixed',
          left: '80px',
          top: closeTooltipPosition.top + 'px',
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
          Close Project
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
        </div>
      )}

      {/* Profile Dialog */}
      {showProfileDialog && (
        <ProfileDialog
          onClose={() => setShowProfileDialog(false)}
          position={dialogPosition}
        />
      )}
    </div>
  );
}
