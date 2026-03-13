import { create } from 'zustand';
import { logger } from '../renderer/logger';

const LOG_PREFIX = '[Store]';

// Contacts store
export const useContactStore = create((set, get) => ({
  contacts: [],
  loading: false,
  error: null,

  loadContacts: async () => {
    logger.info(`${LOG_PREFIX} Loading contacts`);
    set({ loading: true, error: null });
    try {
      const contacts = await window.electronAPI.db.getContacts();
      set({ contacts, loading: false });
      logger.info(`${LOG_PREFIX} Loaded ${contacts.length} contacts`);
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load contacts`, error);
      set({ error: error.message, loading: false });
    }
  },

  createContact: async (data) => {
    logger.info(`${LOG_PREFIX} Creating contact`, data);
    try {
      const contact = await window.electronAPI.db.createContact(data);
      set((state) => ({ contacts: [...state.contacts, contact] }));
      return contact;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to create contact`, error);
      throw error;
    }
  },

  updateContact: async (id, data) => {
    logger.info(`${LOG_PREFIX} Updating contact ${id}`);
    try {
      const contact = await window.electronAPI.db.updateContact(id, data);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? contact : c)),
      }));
      return contact;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to update contact`, error);
      throw error;
    }
  },

  deleteContact: async (id) => {
    logger.info(`${LOG_PREFIX} Deleting contact ${id}`);
    try {
      await window.electronAPI.db.deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      }));
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to delete contact`, error);
      throw error;
    }
  },
}));

// Companies store
export const useCompanyStore = create((set, get) => ({
  companies: [],
  loading: false,
  error: null,

  loadCompanies: async () => {
    logger.info(`${LOG_PREFIX} Loading companies`);
    set({ loading: true, error: null });
    try {
      const companies = await window.electronAPI.db.getCompanies();
      set({ companies, loading: false });
      logger.info(`${LOG_PREFIX} Loaded ${companies.length} companies`);
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load companies`, error);
      set({ error: error.message, loading: false });
    }
  },

  createCompany: async (data) => {
    logger.info(`${LOG_PREFIX} Creating company`, data);
    try {
      const company = await window.electronAPI.db.createCompany(data);
      set((state) => ({ companies: [...state.companies, company] }));
      return company;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to create company`, error);
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    logger.info(`${LOG_PREFIX} Updating company ${id}`);
    try {
      const company = await window.electronAPI.db.updateCompany(id, data);
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? company : c)),
      }));
      return company;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to update company`, error);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    logger.info(`${LOG_PREFIX} Deleting company ${id}`);
    try {
      await window.electronAPI.db.deleteCompany(id);
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
      }));
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to delete company`, error);
      throw error;
    }
  },
}));

// Deals store
export const useDealStore = create((set, get) => ({
  deals: [],
  pipelineSummary: [],
  loading: false,
  error: null,

  loadDeals: async () => {
    logger.info(`${LOG_PREFIX} Loading deals`);
    set({ loading: true, error: null });
    try {
      const deals = await window.electronAPI.db.getDeals();
      set({ deals, loading: false });
      logger.info(`${LOG_PREFIX} Loaded ${deals.length} deals`);
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load deals`, error);
      set({ error: error.message, loading: false });
    }
  },

  loadPipelineSummary: async () => {
    logger.info(`${LOG_PREFIX} Loading pipeline summary`);
    try {
      const summary = await window.electronAPI.db.getPipelineSummary();
      set({ pipelineSummary: summary });
      return summary;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load pipeline summary`, error);
      throw error;
    }
  },

  createDeal: async (data) => {
    logger.info(`${LOG_PREFIX} Creating deal`, data);
    try {
      const deal = await window.electronAPI.db.createDeal(data);
      set((state) => ({ deals: [...state.deals, deal] }));
      return deal;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to create deal`, error);
      throw error;
    }
  },

  updateDeal: async (id, data) => {
    logger.info(`${LOG_PREFIX} Updating deal ${id}`);
    try {
      const deal = await window.electronAPI.db.updateDeal(id, data);
      set((state) => ({
        deals: state.deals.map((d) => (d.id === id ? deal : d)),
      }));
      return deal;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to update deal`, error);
      throw error;
    }
  },

  deleteDeal: async (id) => {
    logger.info(`${LOG_PREFIX} Deleting deal ${id}`);
    try {
      await window.electronAPI.db.deleteDeal(id);
      set((state) => ({
        deals: state.deals.filter((d) => d.id !== id),
      }));
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to delete deal`, error);
      throw error;
    }
  },
}));

// Tasks store
export const useTaskStore = create((set, get) => ({
  tasks: [],
  upcomingTasks: [],
  loading: false,
  error: null,

  loadTasks: async () => {
    logger.info(`${LOG_PREFIX} Loading tasks`);
    set({ loading: true, error: null });
    try {
      const tasks = await window.electronAPI.db.getTasks();
      set({ tasks, loading: false });
      logger.info(`${LOG_PREFIX} Loaded ${tasks.length} tasks`);
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load tasks`, error);
      set({ error: error.message, loading: false });
    }
  },

  loadUpcomingTasks: async (days = 7) => {
    logger.info(`${LOG_PREFIX} Loading upcoming tasks for ${days} days`);
    try {
      const upcoming = await window.electronAPI.db.getUpcomingTasks(days);
      set({ upcomingTasks: upcoming });
      return upcoming;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load upcoming tasks`, error);
      throw error;
    }
  },

  createTask: async (data) => {
    logger.info(`${LOG_PREFIX} Creating task`, data);
    try {
      const task = await window.electronAPI.db.createTask(data);
      set((state) => ({ tasks: [...state.tasks, task] }));
      return task;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to create task`, error);
      throw error;
    }
  },

  updateTask: async (id, data) => {
    logger.info(`${LOG_PREFIX} Updating task ${id}`);
    try {
      const task = await window.electronAPI.db.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
      }));
      return task;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to update task`, error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    logger.info(`${LOG_PREFIX} Deleting task ${id}`);
    try {
      await window.electronAPI.db.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to delete task`, error);
      throw error;
    }
  },
}));

// Activities store
export const useActivityStore = create((set, get) => ({
  activities: [],
  recentActivities: [],
  loading: false,
  error: null,

  loadActivities: async () => {
    logger.info(`${LOG_PREFIX} Loading activities`);
    set({ loading: true, error: null });
    try {
      const activities = await window.electronAPI.db.getActivities();
      set({ activities, loading: false });
      logger.info(`${LOG_PREFIX} Loaded ${activities.length} activities`);
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load activities`, error);
      set({ error: error.message, loading: false });
    }
  },

  loadRecentActivities: async (limit = 20) => {
    logger.info(`${LOG_PREFIX} Loading recent activities (limit: ${limit})`);
    try {
      const recent = await window.electronAPI.db.getRecentActivities(limit);
      set({ recentActivities: recent });
      return recent;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to load recent activities`, error);
      throw error;
    }
  },

  createActivity: async (data) => {
    logger.info(`${LOG_PREFIX} Creating activity`, data);
    try {
      const activity = await window.electronAPI.db.createActivity(data);
      set((state) => ({ activities: [...state.activities, activity] }));
      return activity;
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to create activity`, error);
      throw error;
    }
  },

  deleteActivity: async (id) => {
    logger.info(`${LOG_PREFIX} Deleting activity ${id}`);
    try {
      await window.electronAPI.db.deleteActivity(id);
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
      }));
    } catch (error) {
      logger.error(`${LOG_PREFIX} Failed to delete activity`, error);
      throw error;
    }
  },
}));
