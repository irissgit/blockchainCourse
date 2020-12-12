#include<stdio.h>
#include<string.h>

#define MAX 1024000

#define ROTLEFT(a,b) (((a) << (b)) | ((a) >> (32-(b))))
#define ROTRIGHT(a,b) (((a) >> (b)) | ((a) << (32-(b))))
#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define EP0(x) (ROTRIGHT(x,2) ^ ROTRIGHT(x,13) ^ ROTRIGHT(x,22))
#define EP1(x) (ROTRIGHT(x,6) ^ ROTRIGHT(x,11) ^ ROTRIGHT(x,25))
#define SIG0(x) (ROTRIGHT(x,7) ^ ROTRIGHT(x,18) ^ ((x) >> 3))
#define SIG1(x) (ROTRIGHT(x,17) ^ ROTRIGHT(x,19) ^ ((x) >> 10))

static const unsigned int k[64] = {
	0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
	0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
	0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
	0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
	0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
	0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
	0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
	0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

typedef struct{
    unsigned int dataLength;
    unsigned long long bitLength;
    unsigned int totalLength;
    unsigned int hash[8];//the 256 bits hash result
}SHA256Block;

void BlockInit(SHA256Block* block)
{
    block->bitLength=0;
    block->dataLength=0;
    block->hash[0] = 0x6a09e667;
	block->hash[1] = 0xbb67ae85;
	block->hash[2] = 0x3c6ef372;
	block->hash[3] = 0xa54ff53a;
	block->hash[4] = 0x510e527f;
	block->hash[5] = 0x9b05688c;
	block->hash[6] = 0x1f83d9ab;
	block->hash[7] = 0x5be0cd19;
}

void TextPadding(SHA256Block* block, unsigned char s[])
{
    block->dataLength=strlen(s);
    block->bitLength=block->dataLength*8;
    int chunkNum=block->dataLength/64;
    int remainder=block->dataLength%64;
    int beginNum=chunkNum*64;
    if(remainder<56)
    {
        int i=beginNum+remainder;
        s[i++]=0x80;
        for(;i<beginNum+56;i++)
        {
            s[i]=0x00;
        }
        beginNum+=56; 
    }
    else
    {
        int limit=64-(remainder-56);
        int i=beginNum+remainder;
        s[i++]=0x80;
        for(;i<beginNum+limit;i++)
        {
            s[i]=0x00;
        }
        beginNum+=remainder;
        beginNum+=limit;
    }
    s[beginNum]=(unsigned char)(block->bitLength>>56);
    s[beginNum+1]=(unsigned char)(block->bitLength>>48);
    s[beginNum+2]=(unsigned char)(block->bitLength>>40);
    s[beginNum+3]=(unsigned char)(block->bitLength>>32);
    s[beginNum+4]=(unsigned char)(block->bitLength>>24);
    s[beginNum+5]=(unsigned char)(block->bitLength>>16);
    s[beginNum+6]=(unsigned char)(block->bitLength>>8);
    s[beginNum+7]=(unsigned char)(block->bitLength);
    block->totalLength=beginNum+8;
}

void SHA256Hash(SHA256Block* block, unsigned char* s)
{
    int limit = block->totalLength/64;
    unsigned int a, b, c, d, e, f, g, h,t1, t2, m[64];
    int i=0;
    int j=0;
    for(int x=0;x<limit;x++)
    {
        for (i = 0 ; i < 16 ; i++, j+=4)
		    m[i] = (s[j] << 24) | (s[j + 1] << 16) | (s[j + 2] << 8) | (s[j + 3]);
        for ( ; i < 64; i++)
            m[i] = SIG1(m[i - 2]) + m[i - 7] + SIG0(m[i - 15]) + m[i - 16];

        a = block->hash[0];
        b = block->hash[1];
        c = block->hash[2];
        d = block->hash[3];
        e = block->hash[4];
        f = block->hash[5];
        g = block->hash[6];
        h = block->hash[7];

        for (i = 0; i < 64; ++i) {
            t1 = h + EP1(e) + CH(e,f,g) + k[i] + m[i];
            t2 = EP0(a) + MAJ(a,b,c);
            h = g;
            g = f;
            f = e;
            e = d + t1;
            d = c;
            c = b;
            b = a;
            a = t1 + t2;
        }

        block->hash[0] += a;
        block->hash[1] += b;
        block->hash[2] += c;
        block->hash[3] += d;
        block->hash[4] += e;
        block->hash[5] += f;
        block->hash[6] += g;
        block->hash[7] += h;
        }
}

int SHA256_Dig(unsigned int x,int n){
    unsigned char s[MAX]="I'm satoshi nakamoto2.";
    SHA256Block block;
    printf("%s\n",s);
    for(int j=0;j<n;j++)
    {   
        strcat(s,"1");
    }
    BlockInit(&block);
    TextPadding(&block,s);
    SHA256Hash(&block,s);
    for(int i=0;i<8;i++)
    {
        printf("%08x",block.hash[i]);
    }
    printf("\n");
    if((block.hash[0]&x)==0x00000000)
    {
        //printf("%s\n",s);
        return 1;
    }
    else return 0;
}

void SHA256_Block()
{
    unsigned char s[MAX];
    SHA256Block block;
    //scanf("%s",s); 
    BlockInit(&block);
    TextPadding(&block,s);
    SHA256Hash(&block,s);
    for(int i=0;i<8;i++)
    {
        printf("%08x",block.hash[i]);
    }
    printf("\n");
}

int main()
{
    unsigned int x = 0x00000000;
    int i=0;
    while(1)
    {
        if(SHA256_Dig(x,i))break;
        i++;
    }
    // SHA256_Block();
    // system("pause"); 
    return 0;
}
