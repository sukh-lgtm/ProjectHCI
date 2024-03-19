function Actionbar({onDelete}) {
    return (
        <div
            className="px-6 bg-neutral-800 bg-opacity-80 backdrop-blur-2xl fixed bottom-0 w-full z-10 flex flex-col">
            <div className="grid grid-cols-4 gap-6">
                <button type="button" className="action-bar-button">
                    <svg width="35" height="35" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_255_2541)">
                            <path
                                d="M27.0837 14.5807H22.917V22.9141H14.5837V27.0807H22.917V35.4141H27.0837V27.0807H35.417V22.9141H27.0837V14.5807ZM25.0003 4.16406C13.5003 4.16406 4.16699 13.4974 4.16699 24.9974C4.16699 36.4974 13.5003 45.8307 25.0003 45.8307C36.5003 45.8307 45.8337 36.4974 45.8337 24.9974C45.8337 13.4974 36.5003 4.16406 25.0003 4.16406ZM25.0003 41.6641C15.8128 41.6641 8.33366 34.1849 8.33366 24.9974C8.33366 15.8099 15.8128 8.33073 25.0003 8.33073C34.1878 8.33073 41.667 15.8099 41.667 24.9974C41.667 34.1849 34.1878 41.6641 25.0003 41.6641Z"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_255_2541">
                                <rect width="50" height="50"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <span>
                        Album
                    </span>
                </button>

                <button type="button" className="action-bar-button stroke-neutral-200 focus:stroke-blue-300">
                    <svg width="35" height="35" viewBox="0 0 44 33" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path
                            d="M25.9964 1.03235H25.9966C26.2875 1.03229 26.4905 1.0221 26.67 1.01309C27.0506 0.993996 27.3256 0.9802 28.1077 1.07943C28.9591 1.28537 29.4931 1.53679 29.8448 1.91799L29.8448 1.91801L29.8503 1.92389L42.023 14.9038L42.0312 14.9126L42.0397 14.9212C42.264 15.149 42.3768 15.3405 42.4297 15.4905L42.43 15.4915C42.5055 15.705 42.542 15.9183 42.542 16.1364C42.542 16.3543 42.5056 16.5683 42.4299 16.7834C42.3771 16.9323 42.2643 17.1234 42.0397 17.3516L42.0396 17.3515L42.0302 17.3613L29.8576 30.0697L29.8512 30.0764L29.8448 30.0833C29.3922 30.5737 28.8081 30.9973 28.1622 31.178C27.4238 31.1775 27.0268 31.1775 26.5912 31.1774C26.4091 31.1774 26.2201 31.1774 25.9967 31.1773H25.9964L3.2295 31.1784C2.60703 31.0011 2.05248 30.5703 1.56531 30.0664C1.15731 29.6443 1.00032 29.2331 1.00032 28.8031V3.19902C1.00032 2.76897 1.15731 2.35777 1.56531 1.93573C1.95385 1.53382 2.49015 1.22233 3.22408 1.03235L25.9964 1.03235Z"
                            strokeWidth="3"/>
                        <path
                            d="M32.2231 19.3878C30.3966 19.3573 28.9159 17.8517 28.9159 16.0249C28.9159 14.1981 30.3966 12.7419 32.2231 12.7724C34.0496 12.8029 35.5303 14.3085 35.5303 16.1353C35.5303 17.9621 34.0496 19.4183 32.2231 19.3878Z"
                            strokeWidth="2"/>
                    </svg>

                    <span>
                        Tag
                    </span>

                </button>
                <button type="button" className="action-bar-button">
                    <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg" className="fill-inherit" onClick={onDelete}>
                        <g clipPath="url(#clip0_255_2562)">
                            <path
                                d="M8.75033 27.7083C8.75033 29.3125 10.0628 30.625 11.667 30.625H23.3337C24.9378 30.625 26.2503 29.3125 26.2503 27.7083V10.2083H8.75033V27.7083ZM11.667 13.125H23.3337V27.7083H11.667V13.125ZM22.6045 5.83333L21.1462 4.375H13.8545L12.3962 5.83333H7.29199V8.75H27.7087V5.83333H22.6045Z"
                                />
                        </g>
                        <defs>
                            <clipPath id="clip0_255_2562">
                                <rect width="35" height="35"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <span>
                        Delete
                    </span>
                </button>

                <button type="button" className="action-bar-button">
                    <svg width="35" height="35" viewBox="0 0 35 35" className="fill-inherit" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_255_2593)">
                            <path
                                d="M17.2085 15.8958C13.898 15.0354 12.8335 14.1458 12.8335 12.7604C12.8335 11.1708 14.3064 10.0625 16.771 10.0625C19.3668 10.0625 20.3293 11.3021 20.4168 13.125H23.6397C23.5376 10.6167 22.0064 8.3125 18.9585 7.56875V4.375H14.5835V7.525C11.7543 8.1375 9.4793 9.975 9.4793 12.7896C9.4793 16.1583 12.2647 17.8354 16.3335 18.8125C19.9793 19.6875 20.7085 20.9708 20.7085 22.3271C20.7085 23.3333 19.9939 24.9375 16.771 24.9375C13.7668 24.9375 12.5855 23.5958 12.4251 21.875H9.2168C9.3918 25.0688 11.7835 26.8625 14.5835 27.4604V30.625H18.9585V27.4896C21.8022 26.95 24.0626 25.3021 24.0626 22.3125C24.0626 18.1708 20.5189 16.7562 17.2085 15.8958Z"
                                />
                        </g>
                        <defs>
                            <clipPath id="clip0_255_2593">
                                <rect width="35" height="35" />
                            </clipPath>
                        </defs>
                    </svg>


                    <span>
                        sell
                    </span>
                </button>

            </div>
        </div>
    );
}

export default Actionbar;
