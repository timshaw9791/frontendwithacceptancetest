/**
 * Created by Administrator on 2018/7/19.
 */
import Vue from 'vue'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import {ApolloLink} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {getToken, removeToken} from 'common/js/auth'
import {Message} from 'element-ui'
import store from "store";
import {baseURL,tokenName} from "api/config";

/*import {getToken} from 'common/js/auth'
import {tokenName} from 'api/config';*/
//import capture from './capture';

const httpLink = new HttpLink({
    uri: `${baseURL}/graphql`,
});


const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            [tokenName]: getToken() || null,
        }
    });
    return forward(operation);
});

const authLink = authMiddleware.concat(httpLink);
console.log('authLink',authLink);
const errorLink = onError(({networkError, response}) => {
    console.log(networkError, response);

    let errorMsg = '';
    if (!!response && response.errors !== undefined && response.errors.length) {
        errorMsg = !response.errors[0].message ? '服务器错误' : response.errors[0].message;
        console.log(errorMsg);
        Message.error({
            message: errorMsg
        });
    }
    if (!!networkError) {
        errorMsg = networkError.message;
        if (networkError.result !== undefined) {
            errorMsg = networkError.result.success === false ? networkError.result.message : networkError.result.error;
            console.log(errorMsg);
            Message.error({
                message: errorMsg
            });
        }
    }

    if (networkError['statusCode'] === 401) {
        store.commit('SET_TOKEN', '');
        store.commit('SET_ROLES', []);
        removeToken();
        Message.error({
            message: '用户已经过期!'
        });
    }

});


// Create the apollo client
const apolloClient = new ApolloClient({
    link: errorLink.concat(authLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'ignore'
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all'
        }
    }
});

// Install the vue plugin
Vue.use(VueApollo);


const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
        // See 'apollo' definition
        // For example: default query options
        $query: {
            loadingKey: 'loading',
            /**
             * fetchPolicy determines where the client may return a result from. The options are:
             * - cache-first (default): return result from cache. Only fetch from network if cached result is not available.
             * - cache-and-network: return result from cache first (if it exists), then return network result once it's available.
             * - cache-only: return result from cache if available, fail otherwise.
             * - no-cache: return result from network, fail if network call doesn't succeed, don't save to cache
             * - network-only: return result from network, fail if network call doesn't succeed, save to cache
             * - standby: only for queries that aren't actively watched, but should be available for refetch and updateQueries.


             export type FetchPolicy =
             | 'cache-first'
             | 'cache-and-network'
             | 'network-only'
             | 'cache-only'
             | 'no-cache'
             | 'standby';
             */
            fetchPolicy: 'no-cache',
        },
    },
});
export default apolloProvider.provide();
