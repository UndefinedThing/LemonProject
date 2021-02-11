import React from 'react';
import firebase from "../firebase";
import Contact from '../pages/Contact';

export interface Message {
    convId: string,
    message: any,
    sendedAt: firebase.firestore.Timestamp,
    senderId: string
}

export const defaultMessage: Message = {
    convId: "",
    message: "",
    sendedAt: {} as firebase.firestore.Timestamp,
    senderId: "",
}

export interface Picture {
    id: string,
    filename: string,
    webPath: string,
    base64: string,
}

export interface UserData {
    username: string,
    name: string,
    lastname: string,
    picture: string | null,
    contact: string,
    email: string,
    birthdate: string,
    phone: string,
    description: string,
    uid: string,
    lng?: string
}

export const defaultUserData: UserData = {
    phone: 'default',
    username: 'default',
    name: 'default',
    picture: null,
    contact: '',
    lastname: 'default',
    email: 'default',
    birthdate: 'IonLabel',
    description: 'default',
    uid: 'default',
    
}

export interface Contact {
    uidUser: string,
    contactList: string[],
    myPendingList: string[],
    otPendingList: string[],
    blockedList: string[]
}

export const defaultContact: Contact = {
    uidUser: 'default',
    contactList: [],
    myPendingList: [],
    otPendingList: [],
    blockedList: []
}

export interface Conversation {
    convId: string,
    lastMessage: Message,
    messages: string[],
    users: string[]
}

export const defaultConversation: Conversation = {
    convId: "",
    lastMessage: defaultMessage,
    messages: [],
    users: []
}

export interface Group {
    groupId: string,
    groupName: string,
    lastMessage: Message,
    messages: string[],
    users: string[],
    adminUsers: string[],
    creatorId: string
}

export type UserInformationFields = "username" | "name" | "lastname" | "email" | "description";

interface AppContext {
    initContext: () => void,

    userdata: UserData,
    setupUserData: (userProps: any) => void,
    updateUserData: (updateUser: UserData) => void,
    updateOneFieldUserData: (updateUser: any, field: string, value: any) => void,

    contacts: Contact,
    setupContactList: (user: any) => void,
    addContact: (newContact: string) => void,
    delPendingInvite: (contactId: string) => void,
    refuseInvite: (contactId: string) => void,
    removeContact: (contactId: string) => void,

    conversations: Conversation[],
    sendMessage: (convId: string, message: any) => void,
    startConv: (receiverId: string, message: any) => void,

    groups : Group[],
    createGroup: (creatorUser: string, users: string[], groupName: string, message: string) => void,
    addUsers: (groupId: string, users: string[]) => void,
    promotAdmin: (groupId: string, userId: string) => void,
    demoteAdmin: (groupId: string, userId: string) => void,
    groupSendMessage: (groupId: string, message: any) => void,
    removeUsers: (groupId: string, users: string[]) => void,
    quitGroup: (groupId: string) => void,
    deleteGroup: (groupId: string) => void,

    user: firebase.User | null,
    authenticated: boolean;
    setUser: any;
    loadingAuthState: boolean;

    updateLanguage: (lng: string) => void
}

const AppContext = React.createContext<AppContext>({
    initContext: () => { },

    userdata: defaultUserData,
    setupUserData: () => { },
    updateUserData: () => { },
    updateOneFieldUserData: () => {},

    contacts: defaultContact,
    setupContactList: () => { },
    addContact: () => { },
    delPendingInvite: () => { },
    refuseInvite: () => { },
    removeContact: () => { },
    
    conversations: [],
    sendMessage: () => { },
    startConv: () => { },

    groups: [],
    createGroup: () => { },
    addUsers: () => { },
    promotAdmin: () => { },
    demoteAdmin: () => { },
    groupSendMessage: () => { },
    removeUsers: () => { },
    quitGroup: () => { },
    deleteGroup: () => { },

    user: null,
    authenticated: false,
    setUser: () => {},
    loadingAuthState: false,

    updateLanguage: () => { }
});

export default AppContext