import { createContext, useContext, useState } from "react";

// Interface to define the shape of the context
interface IContext {
    user: any; //user state variable
    token: string | null;
    setUser: React.Dispatch<React.SetStateAction<any>>; //function to update the user state variable
    setToken: (token: string | null) => void; //function to update the token state variable
}

// creating the context, which will be used to share the state between components
const StateContext = createContext<IContext>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

// creating the context provider, which will be used to wrap the components, so they can access the context
export const ContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<any>({
        name: "John Doe",
    });
    const [token, _setToken] = useState<string | null>(
        // localStorage.getItem("ACCESS_TOKEN")
        null
    );

    // function to update the token state variable and save it in the local storage
    const setToken = (token: string | null) => {
        // _setToken: function to update the token state variable
        _setToken(token);
        // if the token is not null, save it in the local storage
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            // if the token is null, remove it from the local storage
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        // StateContext.Provider: component that will provide the context to the children components
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

// function to use the context by the components
export const useStateContext = (): IContext => {
    return useContext(StateContext);
};
