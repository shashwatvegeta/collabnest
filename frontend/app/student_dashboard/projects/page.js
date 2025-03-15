"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/project');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Only filter projects after component is mounted
  const filteredProjects = mounted ? projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Return null during server rendering to avoid hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.logo}>
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={50} 
              height={50} 
            />
          </div>
          
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Link>
            
            <Link href="/projects" className={`${styles.navItem} ${styles.active}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </Link>
            
            <Link href="/notifications" className={styles.navItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </Link>
            
            <Link href="/messages" className={styles.navItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </Link>
            
            <Link href="/profile" className={styles.navItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </nav>
          
          <div className={styles.logout}>
            <Link href="/logout" className={styles.navItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </Link>
          </div>
        </div>
        
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Projects</h1>
              <p className={styles.subtitle}>Browse And Find Projects Relevant For You</p>
            </div>
            
            <div className={styles.profileIcon}>
              {/* Use next/image for profile pic or ensure img is client-side only */}
              <Image 
                src="/profile-placeholder.png" 
                alt="Profile" 
                width={40}
                height={40}
              />
            </div>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search For Projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.filterButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading projects...</div>
          ) : (
            <div className={styles.grid}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project._id} className={styles.card}>
                    <div className={styles.imageContainer}>
                      <Image 
                        src="/project-placeholder.png" 
                        alt={project.project_name} 
                        className={styles.projectImage}
                        width={300}
                        height={150}
                        layout="responsive"
                      />
                      <div className={styles.label}>
                        <span className={styles.projectName}>{project.project_name}</span>
                        <span className={styles.rating}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          4.5
                        </span>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{project.project_name}</h3>
                      <p className={styles.owner}>Posted by {project.project_owner ? (typeof project.project_owner === 'object' && project.project_owner.name ? project.project_owner.name : 'Unknown') : 'Unknown'}</p>
                      <p className={styles.capacity}>Capacity: {project.cap} students</p>
                      <button className={styles.applyButton}>Apply Now</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noProjects}>
                  No projects found. Try a different search term or create a new project.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}