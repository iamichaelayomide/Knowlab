function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#1c5eff] text-[12px] tracking-[2.16px] w-[320px]">SUPERVISOR DESKTOP ROUTES</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#11203b] text-[30px] w-[820px]">Canonical desktop frames for every supervisor-facing route.</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#475a7d] text-[16px] w-[980px]">These artboards map the operational and oversight surfaces for supervisors and keep naming consistent for the detailed build pass.</p>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function NavDashboard() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] overflow-clip rounded-[18px] top-[117px] w-[204px]" data-name="nav-Dashboard">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">Dashboard</p>
    </div>
  );
}

function NavSoPs() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[165px] w-[204px]" data-name="nav-SOPs">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">SOPs</p>
    </div>
  );
}

function NavTests() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[213px] w-[204px]" data-name="nav-Tests">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function NavJobAids() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[261px] w-[204px]" data-name="nav-Job Aids">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function NavTraining() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[309px] w-[204px]" data-name="nav-Training">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function NavQcLog() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[357px] w-[204px]" data-name="nav-QC Log">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function NavMyStaff() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[405px] w-[204px]" data-name="nav-My Staff">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function NavAlerts() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] overflow-clip rounded-[18px] top-[453px] w-[204px]" data-name="nav-Alerts">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Avatar() {
  return (
    <div className="absolute bg-[#dc2626] left-[11px] rounded-[18px] size-[36px] top-[11px]" data-name="avatar">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14px] left-[10px] not-italic size-[20px] text-[12px] text-white top-[11px]">NA</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[60px] left-[17px] rounded-[18px] top-[2143px] w-[204px]" data-name="profile">
      <Avatar />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[18px] left-[57px] not-italic text-[#1e2f50] text-[15px] top-[11px] w-[132px]">Dr. Ngozi Adeyemi</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[13px] left-[57px] not-italic text-[#8194b6] text-[11px] top-[31px] w-[132px]">{`Hematology & Blood Transfusion`}</p>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[2240px] left-0 overflow-clip top-0 w-[240px]" data-name="sidebar">
      <Logo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[140px]">Supervisor workspace</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[21px] not-italic text-[#8194b6] text-[11px] top-[93px] tracking-[1.98px] w-[160px]">CORE</p>
      <NavDashboard />
      <NavSoPs />
      <NavTests />
      <NavJobAids />
      <NavTraining />
      <NavQcLog />
      <NavMyStaff />
      <NavAlerts />
      <Profile />
    </div>
  );
}

function Search() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[489px] rounded-[16px] top-[13px] w-[308px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[14px] top-[10px] w-[244px]">Search unit SOPs, tests, and job aids</p>
    </div>
  );
}

function Home() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[815px] overflow-clip rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[15px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[917px] overflow-clip rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[15px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function ProfileChip() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1019px] overflow-clip rounded-[16px] top-[13px] w-[120px]" data-name="profile-chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[15px] top-[12px] w-[84px]">Hematology</p>
    </div>
  );
}

function Topbar() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="topbar">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[29px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">Dashboard</p>
      <Search />
      <Home />
      <Alerts />
      <ProfileChip />
    </div>
  );
}

function Action() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[1032px] overflow-clip rounded-[16px] top-[154px] w-[156px]" data-name="action">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[28px] not-italic text-[15px] text-white top-[13px] w-[100px]">Open team</p>
    </div>
  );
}

function HeroChip() {
  return (
    <div className="absolute bg-[#2a426c] border border-[#6a7fa8] border-solid h-[34px] left-[28px] overflow-clip rounded-[17px] top-[26px] w-[164px]" data-name="hero-chip">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#dce6ff] text-[11px] top-[7.5px] tracking-[1.98px] w-[136px]">Unit command center</p>
    </div>
  );
}

function HeroPrimary() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[28px] overflow-clip rounded-[16px] top-[194px] w-[140px]" data-name="hero-primary">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[21px] not-italic text-[#1e2f50] text-[15px] top-[12px] w-[100px]">Draft new SOP</p>
    </div>
  );
}

function HeroSecondary() {
  return (
    <div className="absolute bg-[#28466f] border border-[rgba(124,147,183,0.8)] border-solid h-[42px] left-[178px] overflow-clip rounded-[16px] top-[194px] w-[130px]" data-name="hero-secondary">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[25px] not-italic text-[15px] text-white top-[12px] w-[84px]">Open QC log</p>
    </div>
  );
}

function Mini() {
  return (
    <div className="absolute bg-[#27466f] border border-[rgba(124,147,183,0.4)] border-solid h-[54px] left-[828px] not-italic rounded-[20px] top-[30px] w-[280px]" data-name="mini-0">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[15px] text-[#dce6ff] text-[11px] top-[10px] tracking-[1.98px] w-[120px]">Review queue</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[17px] left-[15px] text-[13px] text-white top-[24px] w-[248px]">2 documents visible for action.</p>
    </div>
  );
}

function Mini1() {
  return (
    <div className="absolute bg-[#27466f] border border-[rgba(124,147,183,0.4)] border-solid h-[54px] left-[828px] not-italic rounded-[20px] top-[96px] w-[280px]" data-name="mini-1">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[15px] text-[#dce6ff] text-[11px] top-[10px] tracking-[1.98px] w-[120px]">Training risk</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[17px] left-[15px] text-[13px] text-white top-[24px] w-[248px]">1 overdue and 1 in progress.</p>
    </div>
  );
}

function Mini2() {
  return (
    <div className="absolute bg-[#27466f] border border-[rgba(124,147,183,0.4)] border-solid h-[54px] left-[828px] not-italic rounded-[20px] top-[162px] w-[280px]" data-name="mini-2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[15px] text-[#dce6ff] text-[11px] top-[10px] tracking-[1.98px] w-[120px]">Active alerts</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[17px] left-[15px] text-[13px] text-white top-[24px] w-[248px]">3 unit alerts need attention.</p>
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute h-[242px] left-[270px] rounded-[28px] top-[286px] w-[1140px]" data-name="hero" style={{ backgroundImage: "linear-gradient(165.274deg, rgb(17, 40, 78) 1.4184%, rgb(23, 63, 126) 40.426%, rgb(46, 100, 244) 72.34%)" }}>
      <HeroChip />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[39.2px] leading-[36px] left-[28px] not-italic text-[28px] text-white top-[82px] w-[500px]">Supervise the unit, not just the documents.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[26px] left-[28px] not-italic text-[#e7eeff] text-[15px] top-[160px] w-[520px]">Review risk, staff readiness, and operational exceptions are surfaced together so the dashboard reads like a control view instead of a content index.</p>
      <HeroPrimary />
      <HeroSecondary />
      <Mini />
      <Mini1 />
      <Mini2 />
    </div>
  );
}

function MetricTile() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[132px] left-[270px] rounded-[22px] top-[554px] w-[276px]" data-name="Metric Tile">
      <div className="absolute bg-[#2d63f6] h-[4px] left-[-1px] top-[-1px] w-[276px]" data-name="top-accent" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[20px] left-[17px] not-italic text-[#5e7296] text-[15px] top-[23px] w-[240px]">Assigned staff</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[44.8px] leading-[34px] left-[17px] not-italic text-[#1e2f50] text-[32px] top-[49px] w-[240px]">1</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[91px] w-[240px]">Visible staff records and active access in this unit.</p>
    </div>
  );
}

function MetricTile1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[132px] left-[558px] rounded-[22px] top-[554px] w-[276px]" data-name="Metric Tile">
      <div className="absolute bg-[#2d63f6] h-[4px] left-[-1px] top-[-1px] w-[276px]" data-name="top-accent" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[20px] left-[17px] not-italic text-[#5e7296] text-[15px] top-[23px] w-[240px]">Review risk</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[44.8px] leading-[34px] left-[17px] not-italic text-[#1e2f50] text-[32px] top-[49px] w-[240px]">2</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[91px] w-[240px]">SOPs overdue or already inside escalation range.</p>
    </div>
  );
}

function MetricTile2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[132px] left-[846px] rounded-[22px] top-[554px] w-[276px]" data-name="Metric Tile">
      <div className="absolute bg-[#2d63f6] h-[4px] left-[-1px] top-[-1px] w-[276px]" data-name="top-accent" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[20px] left-[17px] not-italic text-[#5e7296] text-[15px] top-[23px] w-[240px]">Training attention</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[44.8px] leading-[34px] left-[17px] not-italic text-[#1e2f50] text-[32px] top-[49px] w-[240px]">2</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[91px] w-[240px]">Overdue or still in progress competency items.</p>
    </div>
  );
}

function MetricTile3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[132px] left-[1134px] rounded-[22px] top-[554px] w-[276px]" data-name="Metric Tile">
      <div className="absolute bg-[#2d63f6] h-[4px] left-[-1px] top-[-1px] w-[276px]" data-name="top-accent" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[20px] left-[17px] not-italic text-[#5e7296] text-[15px] top-[23px] w-[240px]">Bench scope</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[44.8px] leading-[34px] left-[17px] not-italic text-[#1e2f50] text-[32px] top-[49px] w-[240px]">4</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[91px] w-[240px]">Tests and workflows currently under this unit.</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[15px] size-[42px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="42" rx="16" width="42" />
          <circle cx="21" cy="21" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Control() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[86px] left-[19px] rounded-[20px] top-[93px] w-[295px]" data-name="control-0">
      <Icon />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[71px] not-italic text-[#1e2f50] text-[14px] top-[17px] w-[180px]">Staff and access</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[71px] not-italic text-[#5e7296] text-[12px] top-[39px] w-[200px]">Check active staff, pending risk, and unit assignment.</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[18px] left-[261px] not-italic text-[#8194b6] text-[16px] top-[17px] w-[16px]">→</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[15px] size-[42px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="42" rx="16" width="42" />
          <circle cx="21" cy="21" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Control1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[86px] left-[334px] rounded-[20px] top-[93px] w-[295px]" data-name="control-1">
      <Icon1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[71px] not-italic text-[#1e2f50] text-[14px] top-[17px] w-[180px]">Training follow-up</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[71px] not-italic text-[#5e7296] text-[12px] top-[39px] w-[200px]">Track overdue competency and supervisor notes.</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[18px] left-[261px] not-italic text-[#8194b6] text-[16px] top-[17px] w-[16px]">→</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[15px] size-[42px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="42" rx="16" width="42" />
          <circle cx="21" cy="21" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Control2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[86px] left-[19px] rounded-[20px] top-[193px] w-[295px]" data-name="control-2">
      <Icon2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[71px] not-italic text-[#1e2f50] text-[14px] top-[17px] w-[180px]">Review queue</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[71px] not-italic text-[#5e7296] text-[12px] top-[39px] w-[200px]">Open SOPs that need review or operational follow-up.</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[18px] left-[261px] not-italic text-[#8194b6] text-[16px] top-[17px] w-[16px]">→</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[15px] size-[42px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="42" rx="16" width="42" />
          <circle cx="21" cy="21" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Control3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[86px] left-[334px] rounded-[20px] top-[193px] w-[295px]" data-name="control-3">
      <Icon3 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[71px] not-italic text-[#1e2f50] text-[14px] top-[17px] w-[180px]">Permissions scope</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[71px] not-italic text-[#5e7296] text-[12px] top-[39px] w-[200px]">Confirm what the supervisor role can and cannot change.</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[18px] left-[261px] not-italic text-[#8194b6] text-[16px] top-[17px] w-[16px]">→</p>
    </div>
  );
}

function Controls() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[312px] left-[270px] rounded-[24px] top-[708px] w-[670px]" data-name="controls">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[260px]">Supervisor controls</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[22px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[45px] w-[460px]">Use the same knowledge base, but with visibility into staff, review state, and permissions.</p>
      <Control />
      <Control1 />
      <Control2 />
      <Control3 />
    </div>
  );
}

function Status() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#159a5b] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">Yes</p>
    </div>
  );
}

function Perm() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[87px] w-[410px]" data-name="perm-0">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">view docs</p>
      <Status />
    </div>
  );
}

function Status1() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#159a5b] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">Yes</p>
    </div>
  );
}

function Perm1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[117px] w-[410px]" data-name="perm-1">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">edit docs</p>
      <Status1 />
    </div>
  );
}

function Status2() {
  return (
    <div className="absolute bg-[#fdebec] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#d33a2c] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">No</p>
    </div>
  );
}

function Perm2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[147px] w-[410px]" data-name="perm-2">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">approve docs</p>
      <Status2 />
    </div>
  );
}

function Status3() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#159a5b] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">Yes</p>
    </div>
  );
}

function Perm3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[177px] w-[410px]" data-name="perm-3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">assign training</p>
      <Status3 />
    </div>
  );
}

function Status4() {
  return (
    <div className="absolute bg-[#fdebec] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#d33a2c] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">No</p>
    </div>
  );
}

function Perm4() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[207px] w-[410px]" data-name="perm-4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">manage users</p>
      <Status4 />
    </div>
  );
}

function Status5() {
  return (
    <div className="absolute bg-[#fdebec] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#d33a2c] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">No</p>
    </div>
  );
}

function Perm5() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[237px] w-[410px]" data-name="perm-5">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">export logs</p>
      <Status5 />
    </div>
  );
}

function Status6() {
  return (
    <div className="absolute bg-[#fdebec] h-[24px] left-[321px] overflow-clip rounded-[14px] top-[-1px] w-[76px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[16px] not-italic text-[#d33a2c] text-[11px] top-[5px] tracking-[1.98px] w-[44px]">No</p>
    </div>
  );
}

function Perm6() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[24px] left-[19px] rounded-[12px] top-[267px] w-[410px]" data-name="perm-6">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[4px] w-[180px]">configure AI access</p>
      <Status6 />
    </div>
  );
}

function Scope() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[312px] left-[960px] rounded-[24px] top-[708px] w-[450px]" data-name="scope">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[180px]">Role scope</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[22px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[45px] w-[410px]">Current unit-supervisor permissions exposed in this workspace.</p>
      <Perm />
      <Perm1 />
      <Perm2 />
      <Perm3 />
      <Perm4 />
      <Perm5 />
      <Perm6 />
    </div>
  );
}

function Status7() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[413px] overflow-clip rounded-[14px] top-[21px] w-[92px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[7px] tracking-[1.98px] w-[64px]">Overdue</p>
    </div>
  );
}

function SopRow() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[91px] w-[580px]" data-name="sop-row-0">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[320px]">Full Blood Count - Sysmex XN-350</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[15px] not-italic text-[#8194b6] text-[12px] top-[35px] w-[260px]">SOP-HEM-001 / review due 2025-02-28</p>
      <Status7 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[545px] not-italic text-[#8194b6] text-[14px] top-[25px] w-[14px]">→</p>
    </div>
  );
}

function Status8() {
  return (
    <div className="absolute bg-[#fff3e6] h-[28px] left-[413px] overflow-clip rounded-[14px] top-[21px] w-[92px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d97706] text-[11px] top-[7px] tracking-[1.98px] w-[64px]">Pending</p>
    </div>
  );
}

function SopRow1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[177px] w-[580px]" data-name="sop-row-1">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[320px]">Prothrombin Time and INR - Stago STA-R Max</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[15px] not-italic text-[#8194b6] text-[12px] top-[35px] w-[260px]">SOP-HEM-014 / review due 2025-03-10</p>
      <Status8 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[545px] not-italic text-[#8194b6] text-[14px] top-[25px] w-[14px]">→</p>
    </div>
  );
}

function Status9() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[413px] overflow-clip rounded-[14px] top-[21px] w-[92px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[11px] top-[7px] tracking-[1.98px] w-[64px]">Draft</p>
    </div>
  );
}

function SopRow2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[263px] w-[580px]" data-name="sop-row-2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[320px]">Reticulocyte Count</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[15px] not-italic text-[#8194b6] text-[12px] top-[35px] w-[260px]">SOP-HEM-016 / review due 2026-03-20</p>
      <Status9 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[545px] not-italic text-[#8194b6] text-[14px] top-[25px] w-[14px]">→</p>
    </div>
  );
}

function SopWatch() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[360px] left-[270px] rounded-[24px] top-[1044px] w-[620px]" data-name="sop-watch">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[180px]">SOP review watch</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[22px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[45px] w-[360px]">Documents in the unit that need supervisory attention.</p>
      <SopRow />
      <SopRow1 />
      <SopRow2 />
    </div>
  );
}

function Status10() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[335px] overflow-clip rounded-[14px] top-[21px] w-[115.2px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[7px] tracking-[1.98px] w-[87.2px]">Training overdue</p>
    </div>
  );
}

function Alert() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[91px] w-[460px]" data-name="alert-0">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[260px]">Blood Film Preparation and Malaria Species Identification</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[15px] not-italic text-[#5e7296] text-[12px] top-[33px] w-[280px]">Overdue. Arrange a supervised malaria slide reading session urgently.</p>
      <Status10 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[15px] size-[38px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 38">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="38" rx="14" width="38" />
          <circle cx="19" cy="19" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Status11() {
  return (
    <div className="absolute bg-[#fff3e6] h-[28px] left-[335px] overflow-clip rounded-[14px] top-[21px] w-[88px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d97706] text-[11px] top-[7px] tracking-[1.98px] w-[60px]">high</p>
    </div>
  );
}

function Alert1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[177px] w-[460px]" data-name="alert-1">
      <Icon4 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[65px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[260px]">SOP Overdue</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[65px] not-italic text-[#5e7296] text-[12px] top-[33px] w-[280px]">{`SOP-HEM-001 is overdue for review in Hematology & Blood Transfusion.`}</p>
      <Status11 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[15px] size-[38px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 38">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="38" rx="14" width="38" />
          <circle cx="19" cy="19" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Status12() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[335px] overflow-clip rounded-[14px] top-[21px] w-[88px]" data-name="Status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[7px] tracking-[1.98px] w-[60px]">critical</p>
    </div>
  );
}

function Alert2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[72px] left-[19px] rounded-[20px] top-[263px] w-[460px]" data-name="alert-2">
      <Icon5 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[65px] not-italic text-[#1e2f50] text-[14px] top-[13px] w-[260px]">QC Failure</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[65px] not-italic text-[#5e7296] text-[12px] top-[33px] w-[280px]">A coagulation QC failure remains unsigned in the unit QC log.</p>
      <Status12 />
    </div>
  );
}

function Alerts1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[360px] left-[910px] rounded-[24px] top-[1044px] w-[500px]" data-name="alerts">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[180px]">Training and alerts</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[22px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[45px] w-[360px]">Items that need follow-up across competency and operational updates.</p>
      <Alert />
      <Alert1 />
      <Alert2 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[15px] size-[36px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="36" rx="14" width="36" />
          <circle cx="18" cy="18" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Vis() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[92px] left-[19px] rounded-[20px] top-[91px] w-[374px]" data-name="vis-0">
      <Icon6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[57px] w-[180px]">Activity log</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[73px] not-italic text-[#5e7296] text-[14px] top-[17px] w-[278px]">Trace what staff viewed, acknowledged, or triggered operationally.</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[15px] size-[36px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="36" rx="14" width="36" />
          <circle cx="18" cy="18" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Vis1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[92px] left-[413px] rounded-[20px] top-[91px] w-[374px]" data-name="vis-1">
      <Icon7 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[57px] w-[180px]">Team oversight</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[73px] not-italic text-[#5e7296] text-[14px] top-[17px] w-[278px]">Check training state, roster details, and follow-up risk across unit staff.</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[15px] size-[36px] top-[15px]" data-name="icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="icon">
          <rect fill="var(--fill-0, #E7EFFF)" height="36" rx="14" width="36" />
          <circle cx="18" cy="18" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Vis2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[92px] left-[807px] rounded-[20px] top-[91px] w-[374px]" data-name="vis-2">
      <Icon8 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[18px] left-[15px] not-italic text-[#1e2f50] text-[14px] top-[57px] w-[180px]">QC log</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[73px] not-italic text-[#5e7296] text-[14px] top-[17px] w-[278px]">Open bench quality review and sign-off without leaving the supervisor workspace.</p>
    </div>
  );
}

function Visibility() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[210px] left-[270px] rounded-[24px] top-[1430px] w-[1140px]" data-name="visibility">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[220px]">Operational visibility</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[22px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[45px] w-[420px]">Shortcuts into the pages that now matter for the unit supervisor role.</p>
      <Vis />
      <Vis1 />
      <Vis2 />
    </div>
  );
}

function SupervisorDashboardDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[2240px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Dashboard / Desktop">
      <Sidebar />
      <Topbar />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] tracking-[2.64px] w-[200px]">UNIT SUPERVISOR</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[61.6px] leading-[44px] left-[270px] not-italic text-[#1e2f50] text-[44px] top-[118px] w-[540px]">{`Hematology & Blood Transfusion control workspace`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[22.4px] leading-[28px] left-[270px] not-italic text-[#5e7296] text-[16px] top-[236px] w-[560px]">Operational oversight across SOP review risk, staff readiness, bench coverage, and unit-level access control.</p>
      <Action />
      <Hero />
      <MetricTile />
      <MetricTile1 />
      <MetricTile2 />
      <MetricTile3 />
      <Controls />
      <Scope />
      <SopWatch />
      <Alerts1 />
      <Visibility />
    </div>
  );
}

function Frame2() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame3() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame4() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame5() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorActivityDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Activity / Desktop">
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Activity</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/activity</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorDashboardDesktop />
      <SupervisorActivityDesktop />
    </div>
  );
}

function Frame7() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame8() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame9() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame10() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorCriticalValuesDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Critical Values / Desktop">
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Critical Values</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/critical-values</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Logo1() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav1() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav2() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav3() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav4() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav5() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav6() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav7() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1880px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav />
      <Nav1 />
      <Nav2 />
      <Nav3 />
      <Nav4 />
      <Nav5 />
      <Nav6 />
      <Nav7 />
    </div>
  );
}

function Search1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search unit data</p>
    </div>
  );
}

function Home1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">Notifications</p>
      <Search1 />
      <Home1 />
      <Alerts2 />
      <Chip />
    </div>
  );
}

function I() {
  return (
    <div className="absolute left-[19px] size-[44px] top-[21px]" data-name="i">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="i">
          <rect fill="var(--fill-0, #FFF3E6)" height="44" rx="18" width="44" />
          <circle cx="22" cy="22" fill="var(--fill-0, #D97706)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Type() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[28px] left-[749px] rounded-[14px] top-[17px] w-[140px]" data-name="type">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[13px] not-italic text-[#5e7296] text-[10px] top-[8px] w-[112px]">SOP Review Due</p>
    </div>
  );
}

function U() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[903px] rounded-[14px] top-[17px] w-[56px]" data-name="u">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#2d63f6] text-[10px] top-[9px] w-[28px]">Unread</p>
    </div>
  );
}

function N() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[112px] left-[270px] rounded-[24px] top-[266px] w-[970px]" data-name="n">
      <I />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[20px] left-[79px] not-italic text-[#1e2f50] text-[15px] top-[19px] w-[520px]">SOP-HEM-001 is overdue for review</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[79px] not-italic text-[#5e7296] text-[13px] top-[43px] w-[620px]">Full Blood Count SOP review is 21 days overdue and needs supervisor action.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[79px] not-italic text-[#8194b6] text-[11px] top-[77px] w-[80px]">2025-03-20</p>
      <Type />
      <U />
    </div>
  );
}

function I1() {
  return (
    <div className="absolute left-[19px] size-[44px] top-[21px]" data-name="i">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="i">
          <rect fill="var(--fill-0, #FDEBEC)" height="44" rx="18" width="44" />
          <circle cx="22" cy="22" fill="var(--fill-0, #D33A2C)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Type1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[28px] left-[749px] rounded-[14px] top-[17px] w-[140px]" data-name="type">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[13px] not-italic text-[#5e7296] text-[10px] top-[8px] w-[112px]">QC Failure</p>
    </div>
  );
}

function U1() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[903px] rounded-[14px] top-[17px] w-[56px]" data-name="u">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#2d63f6] text-[10px] top-[9px] w-[28px]">Unread</p>
    </div>
  );
}

function N1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[112px] left-[270px] rounded-[24px] top-[398px] w-[970px]" data-name="n">
      <I1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[20px] left-[79px] not-italic text-[#1e2f50] text-[15px] top-[19px] w-[520px]">Coagulation QC failed on morning shift</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[79px] not-italic text-[#5e7296] text-[13px] top-[43px] w-[620px]">Level 2 PT breached the 1-3s rule and remains unsigned.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[79px] not-italic text-[#8194b6] text-[11px] top-[77px] w-[80px]">2025-03-20</p>
      <Type1 />
      <U1 />
    </div>
  );
}

function I2() {
  return (
    <div className="absolute left-[19px] size-[44px] top-[21px]" data-name="i">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="i">
          <rect fill="var(--fill-0, #E7EFFF)" height="44" rx="18" width="44" />
          <circle cx="22" cy="22" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Type2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[28px] left-[749px] rounded-[14px] top-[17px] w-[140px]" data-name="type">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[13px] not-italic text-[#5e7296] text-[10px] top-[8px] w-[112px]">Pending Approval</p>
    </div>
  );
}

function U2() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[903px] rounded-[14px] top-[17px] w-[56px]" data-name="u">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#2d63f6] text-[10px] top-[9px] w-[28px]">Unread</p>
    </div>
  );
}

function N2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[112px] left-[270px] rounded-[24px] top-[530px] w-[970px]" data-name="n">
      <I2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[20px] left-[79px] not-italic text-[#1e2f50] text-[15px] top-[19px] w-[520px]">SOP-HEM-016 draft submitted for approval</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[79px] not-italic text-[#5e7296] text-[13px] top-[43px] w-[620px]">Reticulocyte Count draft is waiting for supervisor review.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[79px] not-italic text-[#8194b6] text-[11px] top-[77px] w-[80px]">2025-03-20</p>
      <Type2 />
      <U2 />
    </div>
  );
}

function I3() {
  return (
    <div className="absolute left-[19px] size-[44px] top-[21px]" data-name="i">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="i">
          <rect fill="var(--fill-0, #FDEBEC)" height="44" rx="18" width="44" />
          <circle cx="22" cy="22" fill="var(--fill-0, #D33A2C)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Type3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[28px] left-[749px] rounded-[14px] top-[17px] w-[140px]" data-name="type">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[13px] not-italic text-[#5e7296] text-[10px] top-[8px] w-[112px]">Critical Value Undocumented</p>
    </div>
  );
}

function N3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[112px] left-[270px] rounded-[24px] top-[662px] w-[970px]" data-name="n">
      <I3 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[20px] left-[79px] not-italic text-[#1e2f50] text-[15px] top-[19px] w-[520px]">PT-00449 critical value lacks call documentation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[79px] not-italic text-[#5e7296] text-[13px] top-[43px] w-[620px]">Retrospective follow-up is required before the shift closes.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[79px] not-italic text-[#8194b6] text-[11px] top-[77px] w-[80px]">2025-03-20</p>
      <Type3 />
    </div>
  );
}

function I4() {
  return (
    <div className="absolute left-[19px] size-[44px] top-[21px]" data-name="i">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="i">
          <rect fill="var(--fill-0, #FFF3E6)" height="44" rx="18" width="44" />
          <circle cx="22" cy="22" fill="var(--fill-0, #D97706)" id="dot" r="8" />
        </g>
      </svg>
    </div>
  );
}

function Type4() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[28px] left-[749px] rounded-[14px] top-[17px] w-[140px]" data-name="type">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[13px] not-italic text-[#5e7296] text-[10px] top-[8px] w-[112px]">Training Overdue</p>
    </div>
  );
}

function N4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[112px] left-[270px] rounded-[24px] top-[794px] w-[970px]" data-name="n">
      <I4 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[21px] leading-[20px] left-[79px] not-italic text-[#1e2f50] text-[15px] top-[19px] w-[520px]">Adaeze Nwosu is overdue on Blood Film Preparation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[79px] not-italic text-[#5e7296] text-[13px] top-[43px] w-[620px]">Training assignment TR-002 is overdue and still incomplete.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[79px] not-italic text-[#8194b6] text-[11px] top-[77px] w-[80px]">2025-03-20</p>
      <Type4 />
    </div>
  );
}

function SupervisorNotificationsDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1880px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Notifications / Desktop">
      <Sidebar1 />
      <Top />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[200px]">SUPERVISOR NOTIFICATIONS</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[520px]">Unit-level alerts and reminders</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[700px]">QC failures, review-due SOPs, overdue training, undocumented critical values, and shift continuity alerts.</p>
      <N />
      <N1 />
      <N2 />
      <N3 />
      <N4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorCriticalValuesDesktop />
      <SupervisorNotificationsDesktop />
    </div>
  );
}

function Logo2() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav8() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav9() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav10() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav11() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav12() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav13() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav14() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav15() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar2() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[2120px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav8 />
      <Nav9 />
      <Nav10 />
      <Nav11 />
      <Nav12 />
      <Nav13 />
      <Nav14 />
      <Nav15 />
    </div>
  );
}

function Search2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search unit data</p>
    </div>
  );
}

function Home2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top1() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">QC Log</p>
      <Search2 />
      <Home2 />
      <Alerts3 />
      <Chip1 />
    </div>
  );
}

function Sign() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[1030px] rounded-[16px] top-[118px] w-[150px]" data-name="sign">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[114px]">Sign Off Shift QC</p>
    </div>
  );
}

function Date() {
  return (
    <div className="absolute bg-[#eaf0ff] border border-[#2d63f6] border-solid h-[36px] left-[270px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #D33A2C)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#2d63f6] text-[11px] top-[9px] w-[84px]">2025-03-20</p>
    </div>
  );
}

function Date1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[406px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-19</p>
    </div>
  );
}

function Date2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[542px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-18</p>
    </div>
  );
}

function Date3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[678px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-17</p>
    </div>
  );
}

function Date4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[814px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-16</p>
    </div>
  );
}

function Date5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[950px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-15</p>
    </div>
  );
}

function Date6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[36px] left-[1086px] rounded-[18px] top-[266px] w-[126px]" data-name="date">
      <div className="absolute left-[11px] size-[12px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #159A5B)" id="dot" r="6" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[14px] left-[29px] not-italic text-[#5e7296] text-[11px] top-[9px] w-[84px]">2025-03-14</p>
    </div>
  );
}

function Bench() {
  return (
    <div className="absolute bg-[#e7efff] border border-[#c8d7f6] border-solid h-[34px] left-[270px] rounded-[17px] top-[320px] w-[176px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#2d63f6] text-[11px] top-[10.5px] w-[148px]">All Benches</p>
    </div>
  );
}

function Bench1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[34px] left-[456px] rounded-[17px] top-[320px] w-[176px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[10.5px] w-[148px]">Hematology Routine</p>
    </div>
  );
}

function Bench2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[34px] left-[642px] rounded-[17px] top-[320px] w-[176px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[10.5px] w-[148px]">Coagulation</p>
    </div>
  );
}

function Bench3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[34px] left-[828px] rounded-[17px] top-[320px] w-[176px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[10.5px] w-[148px]">Film Reading</p>
    </div>
  );
}

function Bench4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[34px] left-[1014px] rounded-[17px] top-[320px] w-[176px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[10.5px] w-[148px]">Blood Transfusion</p>
    </div>
  );
}

function Status13() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[28px] left-[339px] rounded-[14px] top-[17px] w-[84px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#159a5b] text-[11px] top-[8.5px] w-[56px]">Pass</p>
    </div>
  );
}

function Bench5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[96px] left-[270px] rounded-[22px] top-[378px] w-[470px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[220px]">Hematology Routine</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[220px]">Sysmex XN-350</p>
      <Status13 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[69px] w-[220px]">Signed by Dr. Ngozi</p>
    </div>
  );
}

function Status14() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[339px] rounded-[14px] top-[17px] w-[84px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[8.5px] w-[56px]">Fail</p>
    </div>
  );
}

function Bench6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[96px] left-[760px] rounded-[22px] top-[378px] w-[470px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[220px]">Coagulation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[220px]">Stago STA-R Max</p>
      <Status14 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[69px] w-[220px]">Unsigned - action required</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[255px] not-italic text-[#b42318] text-[12px] top-[69px] w-[180px]">PT: +3.2SD - 1-3s violation</p>
    </div>
  );
}

function Status15() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[28px] left-[339px] rounded-[14px] top-[17px] w-[84px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#5e7296] text-[11px] top-[8.5px] w-[56px]">Not run</p>
    </div>
  );
}

function Bench7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[96px] left-[270px] rounded-[22px] top-[496px] w-[470px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[220px]">Film Reading</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[220px]">Microscope review</p>
      <Status15 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[69px] w-[220px]">Unsigned - action required</p>
    </div>
  );
}

function Status16() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[28px] left-[339px] rounded-[14px] top-[17px] w-[84px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#5e7296] text-[11px] top-[8.5px] w-[56px]">Not run</p>
    </div>
  );
}

function Bench8() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[96px] left-[760px] rounded-[22px] top-[496px] w-[470px]" data-name="bench">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[19px] w-[220px]">Blood Transfusion</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[220px]">Inventory bench</p>
      <Status16 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[69px] w-[220px]">Unsigned - action required</p>
    </div>
  );
}

function Table() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[420px] left-[270px] rounded-[24px] top-[632px] w-[970px]" data-name="table">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[19px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Time</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[105px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Bench</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[191px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Analyser</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[277px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Level</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[363px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Parameter</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[449px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Target</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[535px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Result</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[621px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">SD</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[707px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Westgard</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[793px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Status</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[879px] not-italic text-[#8194b6] text-[10px] top-[17px] w-[72px]">Action</p>
      <div className="absolute bg-[#c8d7f6] h-px left-[-1px] top-[45px] w-[970px]" data-name="line" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">07:45</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[105px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">Coagulation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[191px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">Stago STA-R Max</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[277px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">Abnormal</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[363px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">PT</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[449px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">28.5</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[535px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">37.8</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[621px] not-italic text-[#b42318] text-[11px] top-[53px] w-[74px]">+3.2 SD</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[707px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">1-3s violation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[793px] not-italic text-[#d33a2c] text-[11px] top-[53px] w-[74px]">Fail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[879px] not-italic text-[#5e7296] text-[11px] top-[53px] w-[74px]">Review</p>
      <div className="absolute bg-[#c8d7f6] h-px left-[-1px] top-[137px] w-[970px]" data-name="line" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">07:50</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[105px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">Hematology Routine</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[191px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">Sysmex XN-350</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[277px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">Low</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[363px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">Hb</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[449px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">6.8</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[535px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">7.3</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[621px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">+1.8 SD</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[707px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">1-2s warning</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[793px] not-italic text-[#d97706] text-[11px] top-[145px] w-[74px]">Warning</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[879px] not-italic text-[#5e7296] text-[11px] top-[145px] w-[74px]">&nbsp;</p>
      <div className="absolute bg-[#c8d7f6] h-px left-[-1px] top-[229px] w-[970px]" data-name="line" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">08:10</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[105px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">Coagulation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[191px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">Stago STA-R Max</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[277px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">Normal</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[363px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">APTT</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[449px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">32.0</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[535px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">31.7</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[621px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">-0.2 SD</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[707px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">Pass</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[793px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">Pass</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[879px] not-italic text-[#5e7296] text-[11px] top-[237px] w-[74px]">&nbsp;</p>
    </div>
  );
}

function Ta() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[76px] left-[19px] rounded-[18px] top-[85px] w-[930px]" data-name="ta">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[27px] w-[220px]">Document corrective action</p>
    </div>
  );
}

function Ack() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[48px] left-[19px] rounded-[18px] top-[175px] w-[930px]" data-name="ack">
      <div className="absolute left-[13px] size-[18px] top-[13px]" data-name="cb">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <circle cx="9" cy="9" fill="var(--fill-0, white)" id="cb" r="8.5" stroke="var(--stroke-0, #C8D7F6)" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[41px] not-italic text-[#5e7296] text-[12px] top-[15px] w-[420px]">I have reviewed this QC failure and the corrective action is documented.</p>
    </div>
  );
}

function Fail() {
  return (
    <div className="absolute bg-[#fdebec] border border-[#f3c5c5] border-solid h-[244px] left-[270px] rounded-[24px] top-[1074px] w-[970px]" data-name="fail">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[23.8px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[17px] top-[19px] w-[200px]">Coagulation failure detail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[420px]">PT breached 1-3s violation. Corrective action is required before shift sign-off.</p>
      <Ta />
      <Ack />
    </div>
  );
}

function M() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[54px] left-[19px] not-italic rounded-[18px] top-[57px] w-[170px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[11px] text-[#8194b6] text-[10px] top-[9px] w-[80px]">Runs</p>
      <p className="absolute h-[22.4px] leading-[20px] left-[11px] text-[#1e2f50] text-[16px] top-[25px] w-[40px]">4</p>
    </div>
  );
}

function M1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[54px] left-[201px] not-italic rounded-[18px] top-[57px] w-[170px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[11px] text-[#8194b6] text-[10px] top-[9px] w-[80px]">Passes</p>
      <p className="absolute h-[22.4px] leading-[20px] left-[11px] text-[#1e2f50] text-[16px] top-[25px] w-[40px]">2</p>
    </div>
  );
}

function M2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[54px] left-[383px] not-italic rounded-[18px] top-[57px] w-[170px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[11px] text-[#8194b6] text-[10px] top-[9px] w-[80px]">Warnings</p>
      <p className="absolute h-[22.4px] leading-[20px] left-[11px] text-[#1e2f50] text-[16px] top-[25px] w-[40px]">1</p>
    </div>
  );
}

function M3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[54px] left-[565px] not-italic rounded-[18px] top-[57px] w-[170px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[11px] text-[#8194b6] text-[10px] top-[9px] w-[80px]">Failures</p>
      <p className="absolute h-[22.4px] leading-[20px] left-[11px] text-[#1e2f50] text-[16px] top-[25px] w-[40px]">1</p>
    </div>
  );
}

function Att() {
  return (
    <div className="absolute bg-white h-[22px] left-[19px] top-[121px] w-[930px]" data-name="att">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-0 not-italic text-[#5e7296] text-[12px] top-0 w-[880px]">I, Dr. Ngozi Adeyemi, confirm that QC has been reviewed for this shift. Failures have been investigated and documented.</p>
    </div>
  );
}

function Signoff() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[158px] left-[270px] rounded-[24px] top-[1340px] w-[970px]" data-name="signoff">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[23.8px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[17px] top-[19px] w-[220px]">Sign off morning shift QC</p>
      <M />
      <M1 />
      <M2 />
      <M3 />
      <Att />
    </div>
  );
}

function SupervisorQcLogDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[2120px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / QC Log / Desktop">
      <Sidebar2 />
      <Top1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[140px]">QC OVERSIGHT</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[620px]">{`Hematology & Blood Transfusion QC log`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[620px]">Monitor analytical quality across all benches, review failures, and sign off the shift log.</p>
      <Sign />
      <Date />
      <Date1 />
      <Date2 />
      <Date3 />
      <Date4 />
      <Date5 />
      <Date6 />
      <Bench />
      <Bench1 />
      <Bench2 />
      <Bench3 />
      <Bench4 />
      <Bench5 />
      <Bench6 />
      <Bench7 />
      <Bench8 />
      <Table />
      <Fail />
      <Signoff />
    </div>
  );
}

function Frame12() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame13() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame14() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame15() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorQcDetailDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / QC Detail / Desktop">
      <Frame12 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">QC Detail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/qc-log/[date]</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorQcLogDesktop />
      <SupervisorQcDetailDesktop />
    </div>
  );
}

function Frame17() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame18() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame19() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame20() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorShiftHandoverDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Shift Handover / Desktop">
      <Frame17 />
      <Frame18 />
      <Frame19 />
      <Frame20 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Shift Handover</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/shift-handover</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame21() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame22() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame23() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame24() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorShiftHandoverNewDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Shift Handover New / Desktop">
      <Frame21 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Shift Handover New</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/shift-handover/new</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorShiftHandoverDesktop />
      <SupervisorShiftHandoverNewDesktop />
    </div>
  );
}

function Logo3() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav16() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav17() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav18() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav19() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav20() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav21() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav22() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav23() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar3() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1860px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo3 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav16 />
      <Nav17 />
      <Nav18 />
      <Nav19 />
      <Nav20 />
      <Nav21 />
      <Nav22 />
      <Nav23 />
    </div>
  );
}

function Search3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search SOPs, owners, or codes</p>
    </div>
  );
}

function Home3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top2() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">SOP Management</p>
      <Search3 />
      <Home3 />
      <Alerts4 />
      <Chip2 />
    </div>
  );
}

function New() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[990px] rounded-[16px] top-[118px] w-[126px]" data-name="new">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[90px]">New SOP Draft</p>
    </div>
  );
}

function Export() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1130px] rounded-[16px] top-[118px] w-[110px]" data-name="export">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Export List</p>
    </div>
  );
}

function Metric() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[92px] left-[270px] not-italic rounded-[22px] top-[266px] w-[182px]" data-name="metric">
      <p className="absolute h-[20px] leading-[14px] left-[15px] text-[#8194b6] text-[10px] top-[17px] w-[120px]">Total SOPs</p>
      <p className="absolute h-[36.4px] leading-[30px] left-[15px] text-[#1e2f50] text-[26px] top-[39px] w-[80px]">3</p>
    </div>
  );
}

function Metric1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[92px] left-[464px] not-italic rounded-[22px] top-[266px] w-[182px]" data-name="metric">
      <p className="absolute h-[20px] leading-[14px] left-[15px] text-[#8194b6] text-[10px] top-[17px] w-[120px]">Approved</p>
      <p className="absolute h-[36.4px] leading-[30px] left-[15px] text-[#1e2f50] text-[26px] top-[39px] w-[80px]">1</p>
    </div>
  );
}

function Metric2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[92px] left-[658px] not-italic rounded-[22px] top-[266px] w-[182px]" data-name="metric">
      <p className="absolute h-[20px] leading-[14px] left-[15px] text-[#8194b6] text-[10px] top-[17px] w-[120px]">Review Due</p>
      <p className="absolute h-[36.4px] leading-[30px] left-[15px] text-[#1e2f50] text-[26px] top-[39px] w-[80px]">1</p>
    </div>
  );
}

function Metric3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[92px] left-[852px] not-italic rounded-[22px] top-[266px] w-[182px]" data-name="metric">
      <p className="absolute h-[20px] leading-[14px] left-[15px] text-[#8194b6] text-[10px] top-[17px] w-[120px]">Draft</p>
      <p className="absolute h-[36.4px] leading-[30px] left-[15px] text-[#1e2f50] text-[26px] top-[39px] w-[80px]">1</p>
    </div>
  );
}

function Metric4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[92px] left-[1046px] not-italic rounded-[22px] top-[266px] w-[182px]" data-name="metric">
      <p className="absolute h-[20px] leading-[14px] left-[15px] text-[#8194b6] text-[10px] top-[17px] w-[120px]">Pending Approval</p>
      <p className="absolute h-[36.4px] leading-[30px] left-[15px] text-[#1e2f50] text-[26px] top-[39px] w-[80px]">1</p>
    </div>
  );
}

function Search4() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[40px] left-[19px] rounded-[16px] top-[17px] w-[360px]" data-name="search">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] not-italic text-[#8194b6] text-[13px] top-[11px] w-[220px]">Search SOPs, owners, or codes</p>
    </div>
  );
}

function P() {
  return (
    <div className="absolute bg-[#e7efff] border border-[#c8d7f6] border-solid h-[32px] left-[397px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#2d63f6] text-[11px] top-[9.5px] w-[56px]">All</p>
    </div>
  );
}

function P1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[489px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[56px]">Approved</p>
    </div>
  );
}

function P2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[581px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[56px]">Review Due</p>
    </div>
  );
}

function P3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[673px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[56px]">Draft</p>
    </div>
  );
}

function P4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[765px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[56px]">Pending Approval</p>
    </div>
  );
}

function P5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[857px] rounded-[16px] top-[21px] w-[84px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[56px]">Archived</p>
    </div>
  );
}

function Filter() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[76px] left-[270px] rounded-[24px] top-[382px] w-[970px]" data-name="filter">
      <Search4 />
      <P />
      <P1 />
      <P2 />
      <P3 />
      <P4 />
      <P5 />
    </div>
  );
}

function Warn() {
  return (
    <div className="absolute bg-[#fdebec] border border-[#f3c5c5] border-solid h-[30px] left-[19px] rounded-[15px] top-[17px] w-[450px]" data-name="warn">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[11px] not-italic text-[#b42318] text-[11px] top-[7px] w-[420px]">Review overdue by regulatory schedule. Start review now to reduce governance risk.</p>
    </div>
  );
}

function Status17() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[719px] rounded-[14px] top-[23px] w-[96px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[8.5px] w-[68px]">Overdue</p>
    </div>
  );
}

function Cta() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[807px] rounded-[16px] top-[59px] w-[142px]" data-name="cta">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[106px]">Start Review Now</p>
    </div>
  );
}

function Row() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[126px] left-[270px] rounded-[24px] top-[486px] w-[970px]" data-name="row">
      <Warn />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[59px] w-[430px]">Full Blood Count - Sysmex XN-350</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[83px] w-[420px]">SOP-HEM-001 · Version 4.2 · Review due Feb 28, 2025</p>
      <Status17 />
      <Cta />
    </div>
  );
}

function Status18() {
  return (
    <div className="absolute bg-[#fff3e6] h-[28px] left-[719px] rounded-[14px] top-[23px] w-[96px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d97706] text-[11px] top-[8.5px] w-[68px]">Pending</p>
    </div>
  );
}

function Approve() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[729px] rounded-[16px] top-[67px] w-[82px]" data-name="approve">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[46px]">Approve</p>
    </div>
  );
}

function Rev() {
  return (
    <div className="absolute bg-[#d33a2c] h-[42px] left-[823px] rounded-[16px] top-[67px] w-[126px]" data-name="rev">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[90px]">Request Revision</p>
    </div>
  );
}

function Row1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[126px] left-[270px] rounded-[24px] top-[634px] w-[970px]" data-name="row">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[27px] w-[430px]">Reticulocyte Count</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[51px] w-[420px]">SOP-HEM-016 · Version 1.0 · Review due Mar 20, 2026</p>
      <Status18 />
      <Approve />
      <Rev />
    </div>
  );
}

function Status19() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[719px] rounded-[14px] top-[23px] w-[96px]" data-name="status">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[11px] top-[8.5px] w-[68px]">Draft</p>
    </div>
  );
}

function Cta1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[807px] rounded-[16px] top-[59px] w-[142px]" data-name="cta">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[106px]">Continue Editing</p>
    </div>
  );
}

function Row2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[126px] left-[270px] rounded-[24px] top-[782px] w-[970px]" data-name="row">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[27px] w-[430px]">Peripheral Blood Film Preparation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[51px] w-[420px]">SOP-HEM-017 · Version 0.9 · Review due Apr 10, 2026</p>
      <Status19 />
      <Cta1 />
    </div>
  );
}

function SupervisorSopManagementDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1860px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / SOP Management / Desktop">
      <Sidebar3 />
      <Top2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[160px]">SUPERVISOR SOPS</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[620px]">{`Hematology & Blood Transfusion SOP management`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[660px]">Review approved SOPs, overdue documents, drafts, and pending approval items from one supervisor view.</p>
      <New />
      <Export />
      <Metric />
      <Metric1 />
      <Metric2 />
      <Metric3 />
      <Metric4 />
      <Filter />
      <Row />
      <Row1 />
      <Row2 />
    </div>
  );
}

function Logo4() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav24() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav25() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav26() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav27() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav28() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav29() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav30() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav31() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar4() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1860px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo4 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav24 />
      <Nav25 />
      <Nav26 />
      <Nav27 />
      <Nav28 />
      <Nav29 />
      <Nav30 />
      <Nav31 />
    </div>
  );
}

function Search5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search SOPs, owners, or codes</p>
    </div>
  );
}

function Home4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top3() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">New SOP Draft</p>
      <Search5 />
      <Home4 />
      <Alerts5 />
      <Chip3 />
    </div>
  );
}

function Field() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[19px] not-italic rounded-[16px] top-[19px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">SOP Title</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">Reticulocyte Count Workflow</p>
    </div>
  );
}

function Field1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[329px] not-italic rounded-[16px] top-[19px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">SOP ID</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">SOP-HEM-017</p>
    </div>
  );
}

function Field2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[19px] not-italic rounded-[16px] top-[75px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Unit</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">{`Hematology & Blood Transfusion`}</p>
    </div>
  );
}

function Field3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[329px] not-italic rounded-[16px] top-[75px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Bench</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">Coagulation</p>
    </div>
  );
}

function Field4() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[19px] not-italic rounded-[16px] top-[131px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Owner</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">Dr. Ngozi Adeyemi</p>
    </div>
  );
}

function Field5() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[329px] not-italic rounded-[16px] top-[131px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Reviewer</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">QA Officer</p>
    </div>
  );
}

function Field6() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[19px] not-italic rounded-[16px] top-[187px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Effective date</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">2025-03-20</p>
    </div>
  );
}

function Field7() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[44px] left-[329px] not-italic rounded-[16px] top-[187px] w-[290px]" data-name="field">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[5px] w-[120px]">Review due</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] text-[#5e7296] text-[12px] top-[21px] w-[230px]">2026-03-20</p>
    </div>
  );
}

function Area() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[144px] left-[17px] rounded-[16px] top-[43px] w-[584px]" data-name="area">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[17px] w-[240px]">Enter purpose draft content</p>
    </div>
  );
}

function Sec() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[206px] left-[19px] rounded-[22px] top-[257px] w-[620px]" data-name="sec">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[15px] w-[140px]">Purpose</p>
      <Area />
    </div>
  );
}

function Area1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[144px] left-[17px] rounded-[16px] top-[43px] w-[584px]" data-name="area">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[17px] w-[240px]">Enter quality control draft content</p>
    </div>
  );
}

function Sec1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[206px] left-[19px] rounded-[22px] top-[479px] w-[620px]" data-name="sec">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[15px] w-[140px]">Quality Control</p>
      <Area1 />
    </div>
  );
}

function Area2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[144px] left-[17px] rounded-[16px] top-[43px] w-[584px]" data-name="area">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[17px] not-italic text-[#8194b6] text-[12px] top-[17px] w-[240px]">Enter procedure draft content</p>
    </div>
  );
}

function Sec2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[206px] left-[19px] rounded-[22px] top-[701px] w-[620px]" data-name="sec">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[15px] w-[140px]">Procedure</p>
      <Area2 />
    </div>
  );
}

function Save() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[19px] rounded-[16px] top-[961px] w-[100px]" data-name="save">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[64px]">Save Draft</p>
    </div>
  );
}

function Submit() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[135px] rounded-[16px] top-[961px] w-[156px]" data-name="submit">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[120px]">Submit for Approval</p>
    </div>
  );
}

function Preview() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[305px] rounded-[16px] top-[961px] w-[82px]" data-name="preview">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[46px]">Preview</p>
    </div>
  );
}

function Form() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[1060px] left-[270px] rounded-[24px] top-[266px] w-[660px]" data-name="form">
      <Field />
      <Field1 />
      <Field2 />
      <Field3 />
      <Field4 />
      <Field5 />
      <Field6 />
      <Field7 />
      <Sec />
      <Sec1 />
      <Sec2 />
      <Save />
      <Submit />
      <Preview />
    </div>
  );
}

function N5() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[88px] left-[19px] rounded-[20px] top-[113px] w-[410px]" data-name="n">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[17px] not-italic text-[#5e7296] text-[13px] top-[29px] w-[374px]">The preview will render the SOP the way staff see it after approval.</p>
    </div>
  );
}

function Preview1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[340px] left-[950px] rounded-[24px] top-[266px] w-[450px]" data-name="preview">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[19px] not-italic text-[#2d63f6] text-[11px] top-[19px] w-[120px]">Preview</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[30.8px] leading-[28px] left-[19px] not-italic text-[#1e2f50] text-[22px] top-[43px] w-[220px]">Untitled SOP</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[75px] w-[260px]">{`SOP-HEM-017 · Hematology & Blood Transfusion`}</p>
      <N5 />
    </div>
  );
}

function SupervisorSopManagementNewDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1860px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / SOP Management New / Desktop">
      <Sidebar4 />
      <Top3 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[140px]">NEW SOP DRAFT</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[420px]">Create SOP draft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[620px]">Structured supervisor draft form with bench context, metadata, and preview-oriented section fields.</p>
      <Form />
      <Preview1 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorSopManagementDesktop />
      <SupervisorSopManagementNewDesktop />
    </div>
  );
}

function Logo5() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav32() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav33() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav34() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav35() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav36() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav37() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav38() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav39() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar5() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1980px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo5 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav32 />
      <Nav33 />
      <Nav34 />
      <Nav35 />
      <Nav36 />
      <Nav37 />
      <Nav38 />
      <Nav39 />
    </div>
  );
}

function Search6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search SOPs, owners, or codes</p>
    </div>
  );
}

function Home5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top4() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">SOP Detail</p>
      <Search6 />
      <Home5 />
      <Alerts6 />
      <Chip4 />
    </div>
  );
}

function B1() {
  return (
    <div className="absolute bg-[#fff3e6] h-[30px] left-[19px] rounded-[15px] top-[23px] w-[112px]" data-name="b1">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d97706] text-[11px] top-[9.5px] w-[84px]">Pending approval</p>
    </div>
  );
}

function B2() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[30px] left-[143px] rounded-[15px] top-[23px] w-[90px]" data-name="b2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[8.5px] w-[62px]">Version 1.0</p>
    </div>
  );
}

function B3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[30px] left-[245px] rounded-[15px] top-[23px] w-[150px]" data-name="b3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[8.5px] w-[122px]">Review due Mar 20, 2026</p>
    </div>
  );
}

function Approve1() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[675px] rounded-[16px] top-[17px] w-[86px]" data-name="approve">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[50px]">Approve</p>
    </div>
  );
}

function Rev1() {
  return (
    <div className="absolute bg-[#d33a2c] h-[42px] left-[775px] rounded-[16px] top-[17px] w-[148px]" data-name="rev">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[112px]">Request Revision</p>
    </div>
  );
}

function Sticky() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[78px] left-[270px] rounded-[22px] top-[92px] w-[970px]" data-name="sticky">
      <B1 />
      <B2 />
      <B3 />
      <Approve1 />
      <Rev1 />
    </div>
  );
}

function History() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1098px] rounded-[16px] top-[222px] w-[110px]" data-name="history">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">View History</p>
    </div>
  );
}

function R() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[30px] left-[19px] rounded-[14px] top-[55px] w-[150px]" data-name="r">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[12px] left-[9px] not-italic text-[#5e7296] text-[10px] top-[9px] w-[130px]">Linked item: ja-hem-001</p>
    </div>
  );
}

function R1() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[30px] left-[19px] rounded-[14px] top-[97px] w-[150px]" data-name="r">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[12px] left-[9px] not-italic text-[#5e7296] text-[10px] top-[9px] w-[130px]">Linked item: ja-bt-001</p>
    </div>
  );
}

function Quick() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[180px] left-[1050px] rounded-[24px] top-[320px] w-[190px]" data-name="quick">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[23.8px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[17px] top-[19px] w-[120px]">Quick links</p>
      <R />
      <R1 />
    </div>
  );
}

function N6() {
  return (
    <div className="absolute bg-[#e7efff] left-[19px] rounded-[16px] size-[40px] top-[19px]" data-name="n">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[12px] top-[11px] w-[12px]">1</p>
    </div>
  );
}

function Sec3() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[218px] left-[270px] rounded-[24px] top-[320px] w-[750px]" data-name="sec">
      <N6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[27px] w-[220px]">Purpose</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[639px] not-italic text-[#2d63f6] text-[12px] top-[29px] w-[80px]">Add comment</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[24px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[87px] w-[690px]">To standardise reticulocyte counting on the Sysmex XN-350 for anaemia workup and marrow response assessment.</p>
    </div>
  );
}

function N7() {
  return (
    <div className="absolute bg-[#e7efff] left-[19px] rounded-[16px] size-[40px] top-[19px]" data-name="n">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[12px] top-[11px] w-[12px]">2</p>
    </div>
  );
}

function C() {
  return (
    <div className="absolute bg-[#fff8ef] border border-[#f0d2aa] border-solid h-[44px] left-[19px] rounded-[18px] top-[69px] w-[710px]" data-name="c">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] not-italic text-[#9a6700] text-[11px] top-[13px] w-[682px]">Section 4 (QC): Update Westgard rules to include 10-mean rule per CLSI EP23 recommendations. - Dr. Ngozi, 15 Mar 2025</p>
    </div>
  );
}

function Sec4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[218px] left-[270px] rounded-[24px] top-[558px] w-[750px]" data-name="sec">
      <N7 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[27px] w-[220px]">Procedure</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[639px] not-italic text-[#2d63f6] text-[12px] top-[29px] w-[80px]">Add comment</p>
      <C />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[24px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[127px] w-[690px]">Confirm sample integrity and analyser readiness. Run reticulocyte channel checks before patient work. Review flags before authorisation.</p>
    </div>
  );
}

function N8() {
  return (
    <div className="absolute bg-[#e7efff] left-[19px] rounded-[16px] size-[40px] top-[19px]" data-name="n">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[12px] top-[11px] w-[12px]">3</p>
    </div>
  );
}

function Sec5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[218px] left-[270px] rounded-[24px] top-[796px] w-[750px]" data-name="sec">
      <N8 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[27px] w-[220px]">Quality Control</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[16px] left-[639px] not-italic text-[#2d63f6] text-[12px] top-[29px] w-[80px]">Add comment</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[24px] left-[19px] not-italic text-[#5e7296] text-[14px] top-[87px] w-[690px]">Run and review reticulocyte channel controls and document any deviation before patient release.</p>
    </div>
  );
}

function S() {
  return (
    <div className="absolute bg-[#e7efff] h-[24px] left-[85px] rounded-[12px] top-[9px] w-[56px]" data-name="s">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#2d63f6] text-[10px] top-[7px] w-[28px]">Draft</p>
    </div>
  );
}

function Row3() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[56px] left-[19px] rounded-[18px] top-[55px] w-[150px]" data-name="row">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[11px] w-[50px]">v1.0</p>
      <S />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[12px] left-[11px] not-italic text-[#5e7296] text-[10px] top-[31px] w-[120px]">Effective Mar 20, 2025</p>
    </div>
  );
}

function S1() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[24px] left-[85px] rounded-[12px] top-[9px] w-[56px]" data-name="s">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#159a5b] text-[10px] top-[7px] w-[28px]">Approved</p>
    </div>
  );
}

function Row4() {
  return (
    <div className="absolute bg-[#f3f7ff] border border-[#c8d7f6] border-solid h-[56px] left-[19px] rounded-[18px] top-[125px] w-[150px]" data-name="row">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[11px] not-italic text-[#1e2f50] text-[12px] top-[11px] w-[50px]">v0.9</p>
      <S1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[12px] left-[11px] not-italic text-[#5e7296] text-[10px] top-[31px] w-[120px]">Effective Nov 1, 2024</p>
    </div>
  );
}

function Drawer() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[220px] left-[1050px] rounded-[24px] top-[520px] w-[190px]" data-name="drawer">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[23.8px] leading-[22px] left-[19px] not-italic text-[#1e2f50] text-[17px] top-[19px] w-[120px]">Version history</p>
      <Row3 />
      <Row4 />
    </div>
  );
}

function SupervisorSopManagementDetailDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1980px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / SOP Management Detail / Desktop">
      <Sidebar5 />
      <Top4 />
      <Sticky />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[194px] w-[180px]">SUPERVISOR SOP DETAIL</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[44.8px] leading-[38px] left-[270px] not-italic text-[#1e2f50] text-[32px] top-[220px] w-[420px]">Reticulocyte Count</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[270px] not-italic text-[#5e7296] text-[14px] top-[280px] w-[460px]">{`SOP-HEM-016 · Version 1.0 · Hematology & Blood Transfusion`}</p>
      <History />
      <Quick />
      <Sec3 />
      <Sec4 />
      <Sec5 />
      <Drawer />
    </div>
  );
}

function Frame27() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame28() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame29() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame30() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorSpecimenRejectionsDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Specimen Rejections / Desktop">
      <Frame27 />
      <Frame28 />
      <Frame29 />
      <Frame30 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Specimen Rejections</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/specimen-rejections</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorSopManagementDetailDesktop />
      <SupervisorSpecimenRejectionsDesktop />
    </div>
  );
}

function Logo6() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav40() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav41() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav42() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav43() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav44() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Training</p>
    </div>
  );
}

function Nav45() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav46() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav47() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar6() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1860px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav40 />
      <Nav41 />
      <Nav42 />
      <Nav43 />
      <Nav44 />
      <Nav45 />
      <Nav46 />
      <Nav47 />
    </div>
  );
}

function Search7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search unit data</p>
    </div>
  );
}

function Home6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top5() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">My Staff</p>
      <Search7 />
      <Home6 />
      <Alerts7 />
      <Chip5 />
    </div>
  );
}

function M4() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[270px] not-italic rounded-[20px] top-[266px] w-[182px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Total staff</p>
      <p className="absolute h-[25.2px] leading-[24px] left-[13px] text-[#1e2f50] text-[18px] top-[33px] w-[120px]">1</p>
    </div>
  );
}

function M5() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[464px] not-italic rounded-[20px] top-[266px] w-[182px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Active today</p>
      <p className="absolute h-[25.2px] leading-[24px] left-[13px] text-[#1e2f50] text-[18px] top-[33px] w-[120px]">1</p>
    </div>
  );
}

function M6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[658px] not-italic rounded-[20px] top-[266px] w-[182px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Training compliance</p>
      <p className="absolute h-[25.2px] leading-[24px] left-[13px] text-[#1e2f50] text-[18px] top-[33px] w-[120px]">0%</p>
    </div>
  );
}

function M7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[852px] not-italic rounded-[20px] top-[266px] w-[182px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Overdue training</p>
      <p className="absolute h-[25.2px] leading-[24px] left-[13px] text-[#1e2f50] text-[18px] top-[33px] w-[120px]">1</p>
    </div>
  );
}

function M8() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[1046px] not-italic rounded-[20px] top-[266px] w-[182px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Average last active</p>
      <p className="absolute h-[25.2px] leading-[24px] left-[13px] text-[#1e2f50] text-[18px] top-[33px] w-[120px]">20 Mar 2025</p>
    </div>
  );
}

function Av() {
  return (
    <div className="absolute bg-[#b91c1c] left-[19px] rounded-[28px] size-[56px] top-[21px]" data-name="av">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[16px] left-[17px] not-italic text-[14px] text-white top-[18px] w-[24px]">AN</p>
    </div>
  );
}

function Role() {
  return (
    <div className="absolute bg-[#e7efff] h-[28px] left-[249px] rounded-[14px] top-[21px] w-[62px]" data-name="role">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#2d63f6] text-[11px] top-[8.5px] w-[34px]">Staff</p>
    </div>
  );
}

function Fill() {
  return <div className="absolute bg-[#2d63f6] h-[10px] left-0 rounded-[5px] top-0 w-[310px]" data-name="fill" />;
}

function Bar() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[10px] left-[19px] rounded-[5px] top-[111px] w-[930px]" data-name="bar">
      <Fill />
    </div>
  );
}

function Ov() {
  return (
    <div className="absolute bg-[#fdebec] h-[26px] left-[855px] rounded-[13px] top-[125px] w-[74px]" data-name="ov">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[13px] left-[14px] not-italic text-[#d33a2c] text-[10px] top-[8px] w-[46px]">1 overdue</p>
    </div>
  );
}

function View() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[19px] rounded-[16px] top-[167px] w-[110px]" data-name="view">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">View Profile</p>
    </div>
  );
}

function Assign() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[143px] rounded-[16px] top-[167px] w-[126px]" data-name="assign">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[90px]">Assign Training</p>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[234px] left-[270px] rounded-[24px] top-[382px] w-[970px]" data-name="card">
      <Av />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[22px] left-[93px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[220px]">Adaeze Nwosu</p>
      <Role />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[18px] left-[93px] not-italic text-[#5e7296] text-[13px] top-[51px] w-[180px]">Coagulation</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[93px] not-italic text-[#8194b6] text-[11px] top-[75px] w-[120px]">Active today</p>
      <Bar />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[131px] w-[200px]">1 of 3 assignments complete</p>
      <Ov />
      <View />
      <Assign />
    </div>
  );
}

function SupervisorStaffDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1860px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Staff / Desktop">
      <Sidebar6 />
      <Top5 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[120px]">MY STAFF</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[620px]">{`Hematology & Blood Transfusion staff roster`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[620px]">Check activity, learning compliance, and quick follow-up actions for your unit staff.</p>
      <M4 />
      <M5 />
      <M6 />
      <M7 />
      <M8 />
      <Card />
    </div>
  );
}

function Frame32() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame33() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame34() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame35() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorStaffDetailDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Staff Detail / Desktop">
      <Frame32 />
      <Frame33 />
      <Frame34 />
      <Frame35 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Staff Detail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/staff/[id]</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorStaffDesktop />
      <SupervisorStaffDetailDesktop />
    </div>
  );
}

function Frame37() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame38() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame39() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame40() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorTestsManagementDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Tests Management / Desktop">
      <Frame37 />
      <Frame38 />
      <Frame39 />
      <Frame40 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Tests Management</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/tests-management</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame41() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame42() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame43() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame44() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorTestsManagementDetailDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Tests Management Detail / Desktop">
      <Frame41 />
      <Frame42 />
      <Frame43 />
      <Frame44 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Tests Management Detail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/tests-management/[slug]</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorTestsManagementDesktop />
      <SupervisorTestsManagementDetailDesktop />
    </div>
  );
}

function Logo7() {
  return (
    <div className="absolute bg-[#2d63f6] left-[21px] rounded-[18px] size-[40px] top-[21px]" data-name="logo">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[11px] not-italic size-[20px] text-[14px] text-white top-[11px]">LK</p>
    </div>
  );
}

function Nav48() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[117px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Dashboard</p>
    </div>
  );
}

function Nav49() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[165px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">SOPs</p>
    </div>
  );
}

function Nav50() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[213px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Tests</p>
    </div>
  );
}

function Nav51() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[261px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Job Aids</p>
    </div>
  );
}

function Nav52() {
  return (
    <div className="absolute bg-[#e5eeff] border border-[#e7efff] border-solid h-[40px] left-[17px] rounded-[18px] top-[309px] w-[204px]" data-name="nav">
      <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[18px] left-[35px] not-italic text-[#2d63f6] text-[15px] top-[10px] w-[140px]">Training</p>
    </div>
  );
}

function Nav53() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[357px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">QC Log</p>
    </div>
  );
}

function Nav54() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[405px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">My Staff</p>
    </div>
  );
}

function Nav55() {
  return (
    <div className="absolute bg-[#f2f6fe] h-[40px] left-[17px] rounded-[18px] top-[453px] w-[204px]" data-name="nav">
      <div className="absolute left-[12px] size-[16px] top-[12px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #BDD0F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[18px] left-[36px] not-italic text-[#5e7296] text-[15px] top-[11px] w-[140px]">Alerts</p>
    </div>
  );
}

function Sidebar7() {
  return (
    <div className="absolute bg-[#f2f6fe] border border-[#d9e3f7] border-solid h-[1940px] left-0 top-0 w-[240px]" data-name="sidebar">
      <Logo7 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[71px] not-italic text-[#1e2f50] text-[18px] top-[23px] w-[120px]">Knowlab</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[14px] left-[71px] not-italic text-[#8194b6] text-[12px] top-[45px] w-[130px]">Supervisor workspace</p>
      <Nav48 />
      <Nav49 />
      <Nav50 />
      <Nav51 />
      <Nav52 />
      <Nav53 />
      <Nav54 />
      <Nav55 />
    </div>
  );
}

function Search8() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[38px] left-[519px] rounded-[16px] top-[13px] w-[290px]" data-name="search">
      <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="dot">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" fill="var(--fill-0, #2D63F6)" id="dot" r="8" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[37px] not-italic text-[#8194b6] text-[13px] top-[10px] w-[220px]">Search unit data</p>
    </div>
  );
}

function Home7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[827px] rounded-[16px] top-[13px] w-[86px]" data-name="home">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[50px]">Home</p>
    </div>
  );
}

function Alerts8() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[929px] rounded-[16px] top-[13px] w-[84px]" data-name="alerts">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[48px]">Alerts</p>
    </div>
  );
}

function Chip6() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[1031px] rounded-[16px] top-[13px] w-[110px]" data-name="chip">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[74px]">Supervisor</p>
    </div>
  );
}

function Top6() {
  return (
    <div className="absolute bg-white border border-[#d9e3f7] border-solid h-[66px] left-[240px] top-0 w-[1200px]" data-name="top">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25.2px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[18px] top-[21px] w-[220px]">Training</p>
      <Search8 />
      <Home7 />
      <Alerts8 />
      <Chip6 />
    </div>
  );
}

function Create() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[1068px] rounded-[16px] top-[118px] w-[140px]" data-name="create">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[104px]">Create Assignment</p>
    </div>
  );
}

function M9() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[270px] not-italic rounded-[20px] top-[266px] w-[230px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Total Assignments</p>
      <p className="absolute h-[28px] leading-[26px] left-[13px] text-[#1e2f50] text-[20px] top-[33px] w-[80px]">3</p>
    </div>
  );
}

function M10() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[512px] not-italic rounded-[20px] top-[266px] w-[230px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">In Progress</p>
      <p className="absolute h-[28px] leading-[26px] left-[13px] text-[#1e2f50] text-[20px] top-[33px] w-[80px]">1</p>
    </div>
  );
}

function M11() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[754px] not-italic rounded-[20px] top-[266px] w-[230px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Overdue</p>
      <p className="absolute h-[28px] leading-[26px] left-[13px] text-[#1e2f50] text-[20px] top-[33px] w-[80px]">1</p>
    </div>
  );
}

function M12() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid font-['Inter:Semi_Bold',sans-serif] font-semibold h-[82px] left-[996px] not-italic rounded-[20px] top-[266px] w-[230px]" data-name="m">
      <p className="absolute h-[20px] leading-[14px] left-[13px] text-[#8194b6] text-[10px] top-[13px] w-[130px]">Completed</p>
      <p className="absolute h-[28px] leading-[26px] left-[13px] text-[#1e2f50] text-[20px] top-[33px] w-[80px]">1</p>
    </div>
  );
}

function P6() {
  return (
    <div className="absolute bg-[#e7efff] border border-[#c8d7f6] border-solid h-[32px] left-[19px] rounded-[16px] top-[19px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#2d63f6] text-[11px] top-[9.5px] w-[80px]">All Staff</p>
    </div>
  );
}

function P7() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[137px] rounded-[16px] top-[19px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[80px]">Adaeze Nwosu</p>
    </div>
  );
}

function P8() {
  return (
    <div className="absolute bg-[#e7efff] border border-[#c8d7f6] border-solid h-[32px] left-[19px] rounded-[16px] top-[57px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#2d63f6] text-[11px] top-[9.5px] w-[80px]">All</p>
    </div>
  );
}

function P9() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[137px] rounded-[16px] top-[57px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[80px]">In Progress</p>
    </div>
  );
}

function P10() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[255px] rounded-[16px] top-[57px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[80px]">Overdue</p>
    </div>
  );
}

function P11() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[32px] left-[373px] rounded-[16px] top-[57px] w-[108px]" data-name="p">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[13px] not-italic text-[#5e7296] text-[11px] top-[9.5px] w-[80px]">Completed</p>
    </div>
  );
}

function F() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[102px] left-[270px] rounded-[24px] top-[372px] w-[970px]" data-name="f">
      <P6 />
      <P7 />
      <P8 />
      <P9 />
      <P10 />
      <P11 />
    </div>
  );
}

function S2() {
  return (
    <div className="absolute bg-[#fff3e6] h-[28px] left-[789px] rounded-[14px] top-[17px] w-[110px]" data-name="s">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d97706] text-[11px] top-[8.5px] w-[82px]">in-progress</p>
    </div>
  );
}

function N9() {
  return (
    <div className="absolute bg-[#fff8ef] border border-[#f0d2aa] border-solid h-[36px] left-[19px] rounded-[18px] top-[95px] w-[560px]" data-name="n">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] not-italic text-[#9a6700] text-[11px] top-[10px] w-[520px]">Mandatory competency before unsupervised coagulation work.</p>
    </div>
  );
}

function F1() {
  return <div className="absolute bg-[#2d63f6] h-[10px] left-0 rounded-[5px] top-0 w-[224px]" data-name="f" />;
}

function B() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[10px] left-[19px] rounded-[5px] top-[141px] w-[560px]" data-name="b">
      <F1 />
    </div>
  );
}

function View1() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[769px] rounded-[16px] top-[111px] w-[72px]" data-name="view">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[36px]">View</p>
    </div>
  );
}

function Note() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[855px] rounded-[16px] top-[111px] w-[94px]" data-name="note">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[58px]">Edit Note</p>
    </div>
  );
}

function T() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[168px] left-[270px] rounded-[24px] top-[496px] w-[970px]" data-name="t">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[16px] top-[19px] w-[520px]">Coagulation QC: Westgard Rules and Levy-Jennings</p>
      <S2 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[560px]">Control chart construction, Levy-Jennings plotting, Westgard rules, and practical coagulation QC exercises.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[73px] w-[260px]">Assigned to Adaeze Nwosu · Due Apr 15, 2025</p>
      <N9 />
      <B />
      <View1 />
      <Note />
    </div>
  );
}

function S3() {
  return (
    <div className="absolute bg-[#fdebec] h-[28px] left-[789px] rounded-[14px] top-[17px] w-[110px]" data-name="s">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#d33a2c] text-[11px] top-[8.5px] w-[82px]">overdue</p>
    </div>
  );
}

function N10() {
  return (
    <div className="absolute bg-[#fff8ef] border border-[#f0d2aa] border-solid h-[36px] left-[19px] rounded-[18px] top-[95px] w-[560px]" data-name="n">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] not-italic text-[#9a6700] text-[11px] top-[10px] w-[520px]">Overdue. Arrange a supervised malaria slide reading session urgently.</p>
    </div>
  );
}

function F2() {
  return <div className="absolute bg-[#2d63f6] h-[10px] left-0 rounded-[5px] top-0 w-[336px]" data-name="f" />;
}

function B4() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[10px] left-[19px] rounded-[5px] top-[141px] w-[560px]" data-name="b">
      <F2 />
    </div>
  );
}

function View2() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[769px] rounded-[16px] top-[111px] w-[72px]" data-name="view">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[36px]">View</p>
    </div>
  );
}

function Note1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[855px] rounded-[16px] top-[111px] w-[94px]" data-name="note">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[58px]">Edit Note</p>
    </div>
  );
}

function Rem() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[663px] rounded-[16px] top-[111px] w-[92px]" data-name="rem">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[56px]">Remind</p>
    </div>
  );
}

function T1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[168px] left-[270px] rounded-[24px] top-[684px] w-[970px]" data-name="t">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[16px] top-[19px] w-[520px]">Blood Film Preparation and Malaria Species Identification</p>
      <S3 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[560px]">Competency assessment for blood film preparation, species identification, and parasitaemia quantification.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[73px] w-[260px]">Assigned to Adaeze Nwosu · Due Mar 30, 2025</p>
      <N10 />
      <B4 />
      <View2 />
      <Note1 />
      <Rem />
    </div>
  );
}

function S4() {
  return (
    <div className="absolute bg-[#e8f8ef] h-[28px] left-[789px] rounded-[14px] top-[17px] w-[110px]" data-name="s">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[14px] not-italic text-[#159a5b] text-[11px] top-[8.5px] w-[82px]">completed</p>
    </div>
  );
}

function N11() {
  return (
    <div className="absolute bg-[#fff8ef] border border-[#f0d2aa] border-solid h-[36px] left-[19px] rounded-[18px] top-[95px] w-[560px]" data-name="n">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[13px] not-italic text-[#9a6700] text-[11px] top-[10px] w-[520px]">Completed and signed off. Reassessment due in 12 months.</p>
    </div>
  );
}

function F3() {
  return <div className="absolute bg-[#2d63f6] h-[10px] left-0 rounded-[5px] top-0 w-[560px]" data-name="f" />;
}

function B5() {
  return (
    <div className="absolute bg-[#f3f7ff] h-[10px] left-[19px] rounded-[5px] top-[141px] w-[560px]" data-name="b">
      <F3 />
    </div>
  );
}

function View3() {
  return (
    <div className="absolute bg-[#2d63f6] h-[42px] left-[769px] rounded-[16px] top-[111px] w-[72px]" data-name="view">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[18px] not-italic text-[14px] text-white top-[13px] w-[36px]">View</p>
    </div>
  );
}

function Note2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[855px] rounded-[16px] top-[111px] w-[94px]" data-name="note">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[58px]">Edit Note</p>
    </div>
  );
}

function Sign1() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[42px] left-[663px] rounded-[16px] top-[111px] w-[92px]" data-name="sign">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[18px] left-[17px] not-italic text-[#1e2f50] text-[14px] top-[12px] w-[56px]">Sign Off</p>
    </div>
  );
}

function T2() {
  return (
    <div className="absolute bg-white border border-[#c8d7f6] border-solid h-[168px] left-[270px] rounded-[24px] top-[872px] w-[970px]" data-name="t">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[22.4px] leading-[20px] left-[19px] not-italic text-[#1e2f50] text-[16px] top-[19px] w-[520px]">Specimen Rejection and Critical Values Protocols</p>
      <S4 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[20px] left-[19px] not-italic text-[#5e7296] text-[13px] top-[45px] w-[560px]">Institutional rejection criteria, critical values, and clinician notification steps.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] left-[19px] not-italic text-[#5e7296] text-[12px] top-[73px] w-[260px]">Assigned to Adaeze Nwosu · Due May 1, 2025</p>
      <N11 />
      <B5 />
      <View3 />
      <Note2 />
      <Sign1 />
    </div>
  );
}

function SupervisorTrainingDesktop() {
  return (
    <div className="bg-[#f7f9fc] h-[1940px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Training / Desktop">
      <Sidebar7 />
      <Top6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] leading-[14px] left-[270px] not-italic text-[#2d63f6] text-[11px] top-[92px] w-[160px]">TRAINING OVERSIGHT</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[47.6px] leading-[40px] left-[270px] not-italic text-[#1e2f50] text-[34px] top-[118px] w-[700px]">{`Hematology & Blood Transfusion training oversight`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[24px] left-[270px] not-italic text-[#5e7296] text-[15px] top-[186px] w-[620px]">All unit assignments, due dates, progress, and supervisor follow-up from one place.</p>
      <Create />
      <M9 />
      <M10 />
      <M11 />
      <M12 />
      <F />
      <T />
      <T1 />
      <T2 />
    </div>
  );
}

function Frame46() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame47() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame48() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame49() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorTrainingNewDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Training New / Desktop">
      <Frame46 />
      <Frame47 />
      <Frame48 />
      <Frame49 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Training New</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/training/new</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorTrainingDesktop />
      <SupervisorTrainingNewDesktop />
    </div>
  );
}

function Frame51() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[72px] left-0 top-0 w-[1440px]" data-name="Frame" />;
}

function Frame52() {
  return <div className="absolute bg-[#f7faff] border border-[#d3def5] border-solid h-[1024px] left-0 top-0 w-[264px]" data-name="Frame" />;
}

function Frame53() {
  return <div className="absolute bg-white border border-[#d3def5] border-solid h-[952px] left-[296px] rounded-[24px] top-[84px] w-[1112px]" data-name="Frame" />;
}

function Frame54() {
  return (
    <div className="absolute bg-[#e3edff] content-stretch flex items-start left-[328px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[118px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[180px]">Queued for detailed build</p>
    </div>
  );
}

function SupervisorTrainingDetailDesktop() {
  return (
    <div className="bg-[#f5f9ff] h-[1024px] overflow-clip relative shrink-0 w-[1440px]" data-name="Supervisor / Training Detail / Desktop">
      <Frame51 />
      <Frame52 />
      <Frame53 />
      <Frame54 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[328px] not-italic text-[#11203b] text-[34px] top-[160px] w-[520px]">Training Detail</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[328px] not-italic text-[#475a7d] text-[16px] top-[212px] w-[360px]">/supervisor/training/[id]</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[328px] not-italic text-[#73839f] text-[14px] top-[252px] w-[460px]">Replace this with the final supervisor screen using current repo content and operational fixtures.</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0" data-name="Frame">
      <SupervisorTrainingDetailDesktop />
    </div>
  );
}

export default function SupervisorDesktopBoard() {
  return (
    <div className="bg-[#eef4ff] content-stretch flex flex-col gap-[32px] items-start p-[40px] relative size-full" data-name="Supervisor Desktop Board">
      <Frame />
      <Frame1 />
      <Frame6 />
      <Frame11 />
      <Frame16 />
      <Frame25 />
      <Frame26 />
      <Frame31 />
      <Frame36 />
      <Frame45 />
      <Frame50 />
    </div>
  );
}