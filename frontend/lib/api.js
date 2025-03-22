const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchUserData(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function fetchUserProjects(projects) {
  try {
    var list=[];
    for(var item in projects){

      const response = await fetch(`${API_BASE_URL}/project/${projects[item]}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user projects');
      }
      var i = await response.json();

      list.push(i);
    }
    return list;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
}

export async function fetchRecommendedProjects(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/recommended-projects`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommended projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommended projects:', error);
    throw error;
  }
}

export async function fetchUserAchievements(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/achievements`);
    if (!response.ok) {
      throw new Error('Failed to fetch user achievements');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}

export async function fetchProjectDiscussions(projectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/discussion`);
    if (!response.ok) {
      throw new Error('Failed to fetch project discussions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project discussions:', error);
    throw error;
  }
}

export async function addProjectDiscussion(projectId, title, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/discussion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        project_id: projectId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add discussion thread');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding discussion thread:', error);
    throw error;
  }
}

export async function fetchDiscussionPosts(discussionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/discussion_post`);
    if (!response.ok) {
      throw new Error('Failed to fetch discussion posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching discussion posts:', error);
    throw error;
  }
}

export async function addDiscussionPost(discussionId, message) {
  try {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/discussion_post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reply_message: message,
        discussion_id: discussionId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add discussion post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding discussion post:', error);
    throw error;
  }
}

export async function updateDiscussionPost(discussionId, postId, message) {
  try {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/discussion_post/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reply_message: message,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update discussion post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating discussion post:', error);
    throw error;
  }
}

export async function deleteDiscussionPost(discussionId, postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/discussion_post/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete discussion post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting discussion post:', error);
    throw error;
  }
}

export async function fetchProjectTasks(projectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch project tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
}

export async function addProjectTask(projectId, taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to add project task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding project task:', error);
    throw error;
  }
}

export async function updateProjectTask(projectId, taskId, taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to update project task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating project task:', error);
    throw error;
  }
}

export async function fetchUserCertificates(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/certificates`);
    if (!response.ok) {
      throw new Error('Failed to fetch user certificates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    throw error;
  }
}

export async function createInitialDiscussionThread(projectId, projectName, creatorId, creatorName) {
  try {
    console.log(`Creating initial discussion thread for project: ${projectId}`);
    
    // Create the thread
    const threadResponse = await fetch(`${API_BASE_URL}/projects/${projectId}/discussion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${projectName} Discussion`,
        project_id: projectId,
        created_by: creatorId,
        discussion_id: projectId,
        description: "Welcome to the project discussion! Use this thread to communicate with your team."
      }),
    });

    if (!threadResponse.ok) {
      console.error('Failed to create discussion thread:', await threadResponse.text());
      return null;
    }

    const threadData = await threadResponse.json();
    console.log('Discussion thread created:', threadData);

    // Add initial welcome message
    const welcomeResponse = await fetch(`${API_BASE_URL}/projects/${projectId}/discussion/${threadData._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replies: [
          {
            content: `Welcome to the ${projectName} discussion! I've created this thread for our team to communicate throughout this project.`,
            created_by: creatorId,
            created_at: new Date(),
            created_by_username: creatorName
          }
        ]
      }),
    });

    if (!welcomeResponse.ok) {
      console.error('Failed to add welcome message:', await welcomeResponse.text());
      return threadData;
    }

    console.log('Welcome message added to thread');
    return threadData;
  } catch (error) {
    console.error('Error creating discussion thread:', error);
    return null;
  }
} 

