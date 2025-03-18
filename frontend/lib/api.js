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