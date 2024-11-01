/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    Spotlight: {
      address: "0x0165878a594ca255338adfa4d48449f69242eb8f",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_owner",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "createPost",
          inputs: [
            {
              name: "_title",
              type: "string",
              internalType: "string",
            },
            {
              name: "_content",
              type: "string",
              internalType: "string",
            },
            {
              name: "_nonce",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "_sig",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "deletePost",
          inputs: [
            {
              name: "_id",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "deleteProfile",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "downvote",
          inputs: [
            {
              name: "_id",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "downvotedBy",
          inputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "editPost",
          inputs: [
            {
              name: "_id",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "newContent",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "getCommunityPosts",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              internalType: "struct PostLib.Post[]",
              components: [
                {
                  name: "creator",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "title",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "content",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "id",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "signature",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "createdAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "lastUpdatedAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "upvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "downvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getPost",
          inputs: [
            {
              name: "_post_sig",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct PostLib.Post",
              components: [
                {
                  name: "creator",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "title",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "content",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "id",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "signature",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "createdAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "lastUpdatedAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "upvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "downvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getPostsOfAddress",
          inputs: [
            {
              name: "_addr",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              internalType: "struct PostLib.Post[]",
              components: [
                {
                  name: "creator",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "title",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "content",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "id",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "signature",
                  type: "bytes",
                  internalType: "bytes",
                },
                {
                  name: "nonce",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "createdAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "lastUpdatedAt",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "upvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "downvoteCount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getProfile",
          inputs: [
            {
              name: "a",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct Spotlight.Profile",
              components: [
                {
                  name: "username",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "reputation",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "isRegistered",
          inputs: [
            {
              name: "a",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "registerProfile",
          inputs: [
            {
              name: "_username",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "updateUsername",
          inputs: [
            {
              name: "_newUsername",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "upvote",
          inputs: [
            {
              name: "_id",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "upvotedBy",
          inputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "PostCreated",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "id",
              type: "bytes",
              indexed: true,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PostDeleted",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "id",
              type: "bytes",
              indexed: true,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PostDownvoted",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "id",
              type: "bytes",
              indexed: true,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PostEdited",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "id",
              type: "bytes",
              indexed: true,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PostUpvoted",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "id",
              type: "bytes",
              indexed: true,
              internalType: "bytes",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ProfileDeleted",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ProfileRegistered",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "username",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ProfileUpdated",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newUsername",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
