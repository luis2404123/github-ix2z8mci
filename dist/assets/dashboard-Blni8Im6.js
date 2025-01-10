import{s as r,A as c}from"./auth-ukEJXvp4.js";/* empty css                  */class m{static async getDashboardStats(){try{const{data:{user:t}}=await r.auth.getUser();if(!t)throw new Error("User not authenticated");const{count:n}=await r.from("documents").select("*",{count:"exact"}).eq("user_id",t.id),{count:e}=await r.from("translations").select("*",{count:"exact"}).eq("user_id",t.id),{count:s}=await r.from("qr_codes").select("*",{count:"exact"}).eq("user_id",t.id).eq("active",!0),{data:a}=await r.from("activity_log").select("*").eq("user_id",t.id).order("created_at",{ascending:!1}).limit(5);return{totalDocuments:n||0,totalTranslations:e||0,activeQRCodes:s||0,recentActivity:a||[]}}catch(t){return console.error("Error fetching dashboard stats:",t),{totalDocuments:0,totalTranslations:0,activeQRCodes:0,recentActivity:[]}}}}function h(i){const n=new Date-new Date(i),e=Math.floor(n/6e4),s=Math.floor(e/60),a=Math.floor(s/24);return a>7?new Date(i).toLocaleDateString():a>0?`${a}d ago`:s>0?`${s}h ago`:e>0?`${e}m ago`:"Just now"}class v{constructor(t){this.container=document.getElementById(t),this.setupIntersectionObserver()}setupIntersectionObserver(){const t={root:null,rootMargin:"0px",threshold:.1};this.observer=new IntersectionObserver(n=>{n.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),this.observer.unobserve(e.target))})},t)}getActivityIcon(t){return{created:{icon:"note_add",color:"#4caf50"},completed:{icon:"task_alt",color:"#2196f3"},failed:{icon:"error",color:"#f44336"},processing:{icon:"sync",color:"#ff9800"},pending:{icon:"hourglass_empty",color:"#9c27b0"}}[t]||{icon:"info",color:"#757575"}}getActivityType(t){return Object.keys({completed:"completed",failed:"failed",processing:"processing",pending:"pending"}).find(e=>t.toLowerCase().includes(e))||"created"}extractLanguages(t){const n=t.match(/\(([^)]+)\)/);if(n){const[e,s]=n[1].split("→").map(a=>a.trim());return{source:e,target:s}}return{source:"Unknown",target:"Unknown"}}renderActivity(t,n){const e=this.getActivityType(t.description),{icon:s,color:a}=this.getActivityIcon(e),{source:l,target:d}=this.extractLanguages(t.description),u=n*100,o=document.createElement("div");return o.className=`activity-item ${e}`,o.style.setProperty("--animation-delay",`${u}ms`),o.innerHTML=`
      <div class="activity-icon">
        <span class="material-symbols-outlined">${s}</span>
      </div>
      <div class="activity-content">
        <div class="activity-title">${t.description}</div>
        <div class="activity-meta">
          <div class="time-badge">
            <span class="material-symbols-outlined">schedule</span>
            ${h(t.created_at)}
          </div>
          <div class="language-pills">
            <span class="language-pill">${l}</span>
            <span class="material-symbols-outlined">arrow_forward</span>
            <span class="language-pill">${d}</span>
          </div>
        </div>
      </div>
      <div class="activity-actions">
        <button class="action-btn" title="View Details">
          <span class="material-symbols-outlined">visibility</span>
        </button>
      </div>
    `,this.observer.observe(o),o}update(t){if(this.container){if(!t.length){this.container.innerHTML=`
        <div class="no-activity">
          <span class="material-symbols-outlined">history</span>
          <h3>No Recent Activity</h3>
          <p>Start by creating a new translation</p>
          <button class="primary-btn">
            <span class="material-symbols-outlined">add</span>
            New Translation
          </button>
        </div>
      `;return}this.container.innerHTML="",t.forEach((n,e)=>{this.container.appendChild(this.renderActivity(n,e))})}}}class p{constructor(){this.activityList=new v("activity-list"),this.init()}async init(){const{user:t,error:n}=await c.getCurrentUser();if(n||!t){window.location.href="/Login/login.html";return}this.initializeUI(t),this.initializeEventListeners(),this.loadDashboardData()}initializeUI(t){document.getElementById("user-name").textContent=t.user_metadata.full_name||"User",document.getElementById("user-email").textContent=t.email}initializeEventListeners(){document.getElementById("logout-btn").addEventListener("click",async()=>{const{error:s}=await c.signOut();s||(window.location.href="/Login/login.html")});const t=document.querySelector(".action-btn:nth-child(1)"),n=document.querySelector(".action-btn:nth-child(2)"),e=document.querySelector(".action-btn:nth-child(3)");t==null||t.addEventListener("click",()=>{window.location.href="/pages/translations.html"}),n==null||n.addEventListener("click",()=>{window.location.href="/pages/translations.html"}),e==null||e.addEventListener("click",()=>{window.location.href="/pages/qr-codes.html"})}async loadDashboardData(){try{const t=await m.getDashboardStats();this.updateDashboardStats(t),this.updateRecentActivity(t.recentActivity)}catch(t){console.error("Error loading dashboard data:",t),this.showError("Failed to load dashboard data")}}updateDashboardStats(t){const n={"total-documents":t.totalDocuments,"total-translations":t.totalTranslations,"active-qr-codes":t.activeQRCodes};Object.entries(n).forEach(([e,s])=>{const a=document.getElementById(e);a&&(a.textContent=s,a.classList.add("stat-updated"),setTimeout(()=>a.classList.remove("stat-updated"),1e3))})}updateRecentActivity(t){this.activityList.update(t)}showError(t){const n=document.querySelector(".main-content");if(!n)return;const e=document.createElement("div");e.className="error-message",e.textContent=t,n.insertBefore(e,n.firstChild),setTimeout(()=>e.remove(),5e3)}}document.addEventListener("DOMContentLoaded",()=>{new p});
